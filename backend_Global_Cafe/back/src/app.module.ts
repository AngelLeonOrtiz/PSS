import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { UsersModule } from './auth/users.module';
import { AnalisisModule } from './reception/analisis.module';
import { PrismaService } from './prisma.service';
import { ReceptionModule } from './reception/reception.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [AuthModule, UsersModule, ReceptionModule, RolesModule, CatalogsModule, AnalisisModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
