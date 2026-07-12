import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../../../../common/crud/base-repository';
import { NumberSequence } from '../models/number-sequence.entity';

@Injectable()
export class NumberSequencesRepository extends BaseRepository<NumberSequence, any, any> {
  protected dtoClass = class {} as any;
  protected sortableFields = { id: 'id', prefix: 'prefix' };
  protected rootFilterConfig = { filterableFields: { id: 'id', prefix: 'prefix' } };

  constructor(
    @InjectRepository(NumberSequence)
    protected readonly repository: Repository<NumberSequence>,
  ) {
    super();
  }

  async findByPrefix(prefix: string): Promise<NumberSequence | null> {
    return this.repository.findOne({ where: { prefix } as any });
  }
}
