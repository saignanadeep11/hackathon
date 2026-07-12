import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  Brackets,
  DeepPartial,
  In,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import {
  CursorPageInfo,
  FilterNode,
  FilterNodeConfig,
  OffsetPageInfo,
  QueryArgs,
  ScalarFilterValue,
} from './base-crud.types';
import { SortDirection } from './base-crud.dtos';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export type ConnectionResult<T> = {
  edges: Array<{ cursor: string; node: T }>;
  pageInfo: CursorPageInfo;
  offsetPageInfo: OffsetPageInfo;
  totalCount: number;
};

export abstract class BaseRepository<
  TEntity extends ObjectLiteral & { id: string },
  TDto,
  TFilter,
> {
  protected abstract repository: Repository<TEntity>;
  protected abstract dtoClass: new () => TDto;
  protected abstract sortableFields: Record<string, string>;
  protected abstract rootFilterConfig: FilterNodeConfig;

  private paramIndex = 0;

  async findAll(
    args: QueryArgs<TFilter>,
    selectedFields?: string[],
    includeTotalCount = true,
  ): Promise<ConnectionResult<TDto>> {
    const qb = this.repository.createQueryBuilder('e');
    this.setRelationsForSelect(qb);

    // Apply AST Selected Fields
    if (selectedFields && selectedFields.length > 0) {
      // Always select ID
      const selectArgs = ['e.id', ...selectedFields.map((f) => `e.${f}`)];
      qb.select(selectArgs);
    }

    if (args.filter) {
      this.applyFilterRecursive(qb, args.filter, 'e', this.rootFilterConfig);
    }

    const cursorMode = this.resolveCursorMode(args);

    if (cursorMode !== 'none' && args.sort?.some((s) => s.field !== 'id')) {
      throw new BadRequestException(
        'Cursor pagination currently supports id sort only. Use offset mode for multi-field sorting.',
      );
    }

    if (cursorMode === 'backward') {
      this.applySort(qb, [{ field: 'id', direction: SortDirection.DESC }]);
    } else {
      this.applySort(qb, args.sort);
    }

    const totalCount = includeTotalCount ? await qb.clone().getCount() : 0;

    let edges: Array<{ cursor: string; node: TDto }> = [];
    let hasNextPage = false;
    let hasPreviousPage = false;
    let limit = DEFAULT_LIMIT;
    let offset = args.offset ?? 0;

    if (cursorMode === 'forward') {
      const cursorId = this.decodeCursor(args.after);
      if (cursorId) {
        qb.andWhere('e.id > :cursorId', { cursorId });
      }

      limit = this.normalizeLimit(args.first);
      qb.take(limit + 1);

      const items = await qb.getMany();
      hasNextPage = items.length > limit;
      if (hasNextPage) items.pop();

      edges = items.map((item) => ({
        cursor: this.encodeCursor(item.id),
        node: plainToInstance(this.dtoClass, item),
      }));
      hasPreviousPage = Boolean(args.after);
    } else if (cursorMode === 'backward') {
      const beforeId = this.decodeCursor(args.before);
      if (beforeId) {
        qb.andWhere('e.id < :beforeId', { beforeId });
      }

      limit = this.normalizeLimit(args.last);
      qb.take(limit + 1);

      const items = await qb.getMany();
      hasPreviousPage = items.length > limit;
      if (hasPreviousPage) items.pop();

      const ordered = items.reverse();
      edges = ordered.map((item) => ({
        cursor: this.encodeCursor(item.id),
        node: plainToInstance(this.dtoClass, item),
      }));
      hasNextPage = Boolean(args.before);
    } else {
      limit = this.normalizeLimit(args.limit);
      offset = Math.max(args.offset ?? 0, 0);

      qb.skip(offset).take(limit + 1);
      const items = await qb.getMany();
      hasNextPage = items.length > limit;
      if (hasNextPage) items.pop();

      edges = items.map((item) => ({
        cursor: this.encodeCursor(item.id),
        node: plainToInstance(this.dtoClass, item),
      }));

      hasPreviousPage = offset > 0;
    }

    return {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage,
        startCursor: edges[0]?.cursor ?? null,
        endCursor: edges[edges.length - 1]?.cursor ?? null,
      },
      offsetPageInfo: {
        limit,
        offset,
      },
      totalCount,
    };
  }

  protected applySort(
    qb: SelectQueryBuilder<TEntity>,
    sort?: Array<{ field: string; direction: SortDirection }>,
  ): void {
    const requestedSort = sort ?? [];

    if (requestedSort.length === 0) {
      qb.addOrderBy('e.id', 'ASC');
      return;
    }

    for (const sortItem of requestedSort) {
      const dbField = this.sortableFields[sortItem.field];
      if (!dbField) {
        throw new BadRequestException(
          `Sorting is not allowed on field: ${sortItem.field}`,
        );
      }

      qb.addOrderBy(`e.${dbField}`, sortItem.direction);
    }

    if (!requestedSort.some((item) => item.field === 'id')) {
      qb.addOrderBy('e.id', 'ASC');
    }
  }

  protected applyFilterRecursive(
    qb: SelectQueryBuilder<any>,
    filter: FilterNode,
    alias: string,
    config: FilterNodeConfig,
  ): void {
    if (filter.and?.length) {
      qb.andWhere(
        new Brackets((subQb) => {
          for (const andFilter of filter.and ?? []) {
            subQb.andWhere(
              new Brackets((nestedQb) => {
                this.applyFilterRecursive(
                  nestedQb as unknown as SelectQueryBuilder<TEntity>,
                  andFilter,
                  alias,
                  config,
                );
              }),
            );
          }
        }),
      );
    }

    if (filter.or?.length) {
      qb.andWhere(
        new Brackets((subQb) => {
          let isFirst = true;
          for (const orFilter of filter.or ?? []) {
            const method = isFirst ? 'where' : 'orWhere';
            subQb[method](
              new Brackets((nestedQb) => {
                this.applyFilterRecursive(
                  nestedQb as unknown as SelectQueryBuilder<TEntity>,
                  orFilter,
                  alias,
                  config,
                );
              }),
            );
            isFirst = false;
          }
        }),
      );
    }

    for (const [key, rawValue] of Object.entries(filter)) {
      if (key === 'and' || key === 'or' || rawValue === undefined) {
        continue;
      }

      if (config.relations?.[key] && rawValue && typeof rawValue === 'object') {
        const relation = config.relations[key];
        const relationAlias = `${alias}_${relation.alias}`;

        if (
          !qb.expressionMap.joinAttributes.some(
            (j) => j.alias.name === relationAlias,
          )
        ) {
          qb.leftJoin(`${alias}.${relation.path}`, relationAlias);
        }

        this.applyFilterRecursive(
          qb,
          rawValue as FilterNode,
          relationAlias,
          relation.node,
        );
        continue;
      }

      const dbField = config.filterableFields[key];
      if (!dbField) {
        continue;
      }

      const value = rawValue as ScalarFilterValue;
      this.applyScalarOperators(qb, alias, dbField, value);
    }
  }

  protected applyScalarOperators(
    qb: SelectQueryBuilder<TEntity>,
    alias: string,
    dbField: string,
    filter: ScalarFilterValue,
  ): void {
    this.addFilterCondition(qb, alias, dbField, '=', filter.eq);
    this.addFilterCondition(qb, alias, dbField, '!=', filter.ne);
    this.addFilterCondition(qb, alias, dbField, '>', filter.gt);
    this.addFilterCondition(qb, alias, dbField, '>=', filter.gte);
    this.addFilterCondition(qb, alias, dbField, '<', filter.lt);
    this.addFilterCondition(qb, alias, dbField, '<=', filter.lte);

    if (filter.in?.length) {
      const key = this.nextParamKey(dbField);
      qb.andWhere(`${alias}.${dbField} IN (:...${key})`, { [key]: filter.in });
    }

    if (filter.nin?.length) {
      const key = this.nextParamKey(dbField);
      qb.andWhere(`${alias}.${dbField} NOT IN (:...${key})`, {
        [key]: filter.nin,
      });
    }

    this.addFilterCondition(qb, alias, dbField, 'LIKE', filter.like);
    this.addFilterCondition(qb, alias, dbField, 'ILIKE', filter.ilike);

    if (filter.contains != null) {
      this.addFilterCondition(
        qb,
        alias,
        dbField,
        'LIKE',
        `%${filter.contains}%`,
      );
    }
    if (filter.startsWith != null) {
      this.addFilterCondition(
        qb,
        alias,
        dbField,
        'LIKE',
        `${filter.startsWith}%`,
      );
    }
    if (filter.endsWith != null) {
      this.addFilterCondition(
        qb,
        alias,
        dbField,
        'LIKE',
        `%${filter.endsWith}`,
      );
    }

    if (filter.icontains != null) {
      this.addFilterCondition(
        qb,
        alias,
        dbField,
        'ILIKE',
        `%${filter.icontains}%`,
      );
    }
    if (filter.istartsWith != null) {
      this.addFilterCondition(
        qb,
        alias,
        dbField,
        'ILIKE',
        `${filter.istartsWith}%`,
      );
    }
    if (filter.iendsWith != null) {
      this.addFilterCondition(
        qb,
        alias,
        dbField,
        'ILIKE',
        `%${filter.iendsWith}`,
      );
    }

    if (filter.isNull !== undefined) {
      qb.andWhere(
        filter.isNull
          ? `${alias}.${dbField} IS NULL`
          : `${alias}.${dbField} IS NOT NULL`,
      );
    }
  }

  private resolveCursorMode(
    args: QueryArgs<TFilter>,
  ): 'forward' | 'backward' | 'none' {
    const hasForward = args.first !== undefined || args.after !== undefined;
    const hasBackward = args.last !== undefined || args.before !== undefined;

    if (hasForward && hasBackward) {
      throw new BadRequestException(
        'Use either forward cursor args (first/after) or backward cursor args (last/before), not both.',
      );
    }

    if (hasForward) {
      if (args.first === undefined) {
        throw new BadRequestException(
          '`first` is required when using `after`.',
        );
      }
      return 'forward';
    }

    if (hasBackward) {
      if (args.last === undefined) {
        throw new BadRequestException(
          '`last` is required when using `before`.',
        );
      }
      return 'backward';
    }

    return 'none';
  }

  private addFilterCondition(
    qb: SelectQueryBuilder<TEntity>,
    alias: string,
    dbField: string,
    operator: string,
    value?: string,
  ) {
    if (value == null) return;

    const key = this.nextParamKey(dbField);
    qb.andWhere(`${alias}.${dbField} ${operator} :${key}`, { [key]: value });
  }

  private encodeCursor(id: string): string {
    return Buffer.from(JSON.stringify({ id })).toString('base64');
  }

  private decodeCursor(cursor?: string): string | null {
    if (!cursor) return null;

    try {
      const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString()) as {
        id?: string;
      };
      return decoded.id ?? null;
    } catch {
      throw new BadRequestException('Invalid cursor');
    }
  }

  private normalizeLimit(value?: number): number {
    const parsed = value ?? DEFAULT_LIMIT;
    return Math.min(Math.max(parsed, 1), MAX_LIMIT);
  }

  private nextParamKey(field: string): string {
    this.paramIndex += 1;
    return `${field}_${this.paramIndex}`;
  }

  protected setRelationsForSelect(_qb: SelectQueryBuilder<TEntity>): void {}

  protected async saveOne(entity: DeepPartial<TEntity>): Promise<TEntity> {
    return this.repository.save(entity);
  }

  protected async saveMany(
    entities: DeepPartial<TEntity>[],
  ): Promise<TEntity[]> {
    if (!entities.length) return [];
    return this.repository.save(entities);
  }

  public async createOne(data: DeepPartial<TEntity>): Promise<TEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  public async bulkCreate(data: DeepPartial<TEntity>[]): Promise<TEntity[]> {
    if (!data.length) return [];
    const entities = data.map((item) => this.repository.create(item));
    return this.repository.save(entities);
  }

  public async updateOne(
    id: string,
    data: DeepPartial<TEntity>,
  ): Promise<TEntity | null> {
    const existing = await this.repository.findOne({
      where: { id } as any,
    });
    if (!existing) {
      return null;
    }
    return this.saveOne(Object.assign(existing, data));
  }

  public async bulkUpdate(
    ids: string[],
    data: DeepPartial<TEntity>,
  ): Promise<TEntity[]> {
    if (!ids.length) return [];
    const entities = await this.repository.find({
      where: { id: In(ids) } as any,
    });
    entities.forEach((entity) => Object.assign(entity, data));
    return this.saveMany(entities);
  }

  public async setActive(
    id: string,
    isActive: boolean,
  ): Promise<TEntity | null> {
    const existing = await this.repository.findOne({
      where: { id } as any,
    });
    if (!existing) {
      return null;
    }
    return this.saveOne(this.applyActiveState(existing, isActive));
  }

  public async toggleActive(
    id: string,
    isActive: boolean,
  ): Promise<TEntity | null> {
    const existing = await this.repository.findOne({
      where: { id } as any,
    });
    if (!existing) {
      return null;
    }
    return this.saveOne(this.applyActiveState(existing, isActive));
  }

  protected applyActiveState(entity: TEntity, isActive: boolean): TEntity {
    Object.assign(entity, { isActive } as unknown as Partial<TEntity>);
    return entity;
  }

  public async softDeleteOne(id: string): Promise<boolean> {
    const existing = await this.repository.findOne({
      where: { id } as any,
    });
    if (!existing) {
      return false;
    }
    await this.saveOne(this.applyDeleted(existing));
    return true;
  }

  protected applyDeleted(entity: TEntity): TEntity {
    Object.assign(entity, {
      deletedAt: new Date(),
      isActive: false,
    } as unknown as Partial<TEntity>);
    return entity;
  }

  public async bulkSoftDelete(ids: string[]): Promise<void> {
    if (!ids.length) return;
    await this.repository
      .createQueryBuilder()
      .update()
      .set({
        deletedAt: new Date(),
        isActive: false,
      } as unknown as Partial<TEntity>)
      .where('id IN (:...ids)', { ids })
      .execute();
  }
}
