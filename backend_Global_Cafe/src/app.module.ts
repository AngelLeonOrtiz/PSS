import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './auth/users.module';
import { PrismaService } from './prisma.service';
import { ReceptionModule } from './reception/reception.module';

@Module({
  imports: [AuthModule, UsersModule,ReceptionModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
