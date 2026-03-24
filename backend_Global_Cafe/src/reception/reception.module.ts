import { Module } from '@nestjs/common';
import { ReceptionService } from './reception.service'; 
import { ReceptionController } from './reception.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ReceptionController],
  providers: [ReceptionService, PrismaService],
})
export class ReceptionModule {}