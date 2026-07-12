import { Injectable } from '@nestjs/common';
import { NumberSequencesRepository } from '../../infrastructure/database/repositories/number-sequences.repository';
import { NumberSequence } from '../../infrastructure/database/models/number-sequence.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class NumberSequencesService {
  constructor(
    private readonly repository: NumberSequencesRepository,
    private readonly dataSource: DataSource,
  ) {}

  async generateTag(prefix: string): Promise<string> {
    const seq = await this.dataSource.transaction(async (manager) => {
      const numberSequence = await manager.findOne(NumberSequence, {
        where: { prefix },
        lock: { mode: 'pessimistic_write' },
      });

      if (!numberSequence) {
        throw new Error(`Number sequence with prefix "${prefix}" not found`);
      }

      numberSequence.current_value += 1;
      await manager.save(numberSequence);
      return numberSequence;
    });

    const paddedNumber = String(seq.current_value).padStart(seq.padding, '0');
    return `${prefix}-${paddedNumber}`;
  }
}
