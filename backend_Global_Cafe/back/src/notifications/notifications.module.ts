import { Global, Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Global() // Permite que NotificationsGateway sea inyectable globalmente
@Module({
  providers: [NotificationsGateway],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}