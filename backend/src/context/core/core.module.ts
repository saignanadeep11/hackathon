import { Module } from '@nestjs/common';
import { NumberSequencesModule } from './number-sequences/number-sequences.module';

@Module({
  imports: [NumberSequencesModule],
  exports: [NumberSequencesModule],
})
export class CoreModule {}
