import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Permite conexiones desde tu frontend en React (en producción puedes limitarlo)
  },
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  afterInit(server: Server) {
    console.log('🚀 WebSocket Gateway Inicializado correctamente');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`🟢 Cliente WebSocket conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔴 Cliente WebSocket desconectado: ${client.id}`);
  }

  // Método genérico para emitir cualquier notificación al frontend
  emitNotification(event: string, payload: any) {
    this.server.emit(event, { ...payload, timestamp: new Date() });
  }
}