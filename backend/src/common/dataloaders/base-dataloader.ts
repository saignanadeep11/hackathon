import DataLoader from 'dataloader';
import { In, Repository, ObjectLiteral } from 'typeorm';

/**
 * A generic DataLoader factory that prevents N+1 queries.
 * It batches multiple `findById` requests into a single `IN (...)` database query.
 */
export class BaseDataLoader<T extends ObjectLiteral & { id: string }> {
  public loader: DataLoader<string, T | null>;

  constructor(private readonly repository: Repository<T>) {
    this.loader = new DataLoader<string, T | null>(
      async (keys: readonly string[]) => {
        // Fetch all requested entities in one single query
        const entities = await this.repository.find({
          where: { id: In([...keys]) } as any,
        });

        // Map the entities by ID for quick O(1) lookup
        const entityMap = new Map<string, T>();
        entities.forEach((entity) => {
          entityMap.set(entity.id, entity);
        });

        // Return the entities in the exact order the keys were requested
        return keys.map((key) => entityMap.get(key) || null);
      },
    );
  }

  load(id: string): Promise<T | null> {
    return this.loader.load(id);
  }

  loadMany(ids: string[]): Promise<Array<T | Error | null>> {
    return this.loader.loadMany(ids);
  }
}
