import { Module } from '@nestjs/common';
import { AnalisisService } from './analisis.service';
import { AnalisisController } from './analisis.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AnalisisController],
  providers: [AnalisisService, PrismaService],
  exports: [AnalisisService]
})
export class AnalisisModule {}