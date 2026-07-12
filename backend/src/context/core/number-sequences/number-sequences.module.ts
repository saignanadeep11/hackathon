import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NumberSequence } from './infrastructure/database/models/number-sequence.entity';
import { NumberSequencesRepository } from './infrastructure/database/repositories/number-sequences.repository';
import { NumberSequencesService } from './application/services/number-sequences.service';

@Module({
  imports: [TypeOrmModule.forFeature([NumberSequence])],
  providers: [NumberSequencesService, NumberSequencesRepository],
  exports: [NumberSequencesService, NumberSequencesRepository],
})
export class NumberSequencesModule {}
