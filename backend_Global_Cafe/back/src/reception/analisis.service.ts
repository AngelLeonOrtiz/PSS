import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAnalisisDto, VeredictoGerenciaDto } from './dto/create-analisis.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class AnalisisService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsGateway
  ) {}

  // 1. GUARDAR ANÁLISIS (Desde pantalla de Laboratorio)
  async createAnalisis(dto: CreateAnalisisDto, usuarioId: number) {
    const estadoDestino = await this.prisma.estadoTransaccion.findUnique({
      where: { nombre: 'Muestra Previa Pendiente de Aprobacion' }
    });

    if (!estadoDestino) {
      throw new InternalServerErrorException('El estado "Muestra Previa Pendiente de Aprobacion" no existe en BD');
    }

    // Generar correlativo (Ej: AN-2024-0001)
    const count = await this.prisma.analisisCalidad.count();
    const correlativo = `AN-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const resultado = await this.prisma.$transaction(async (tx) => {
      // A. Guardamos el resultado del laboratorio
      const analisis = await tx.analisisCalidad.create({
        data: {
          id_detalle_recepcion: dto.id_detalle_recepcion,
          id_estado_transaccion: estadoDestino.id_estado_transaccion,
          tipo_analisis: dto.tipo_analisis,
          numero_analisis: correlativo,
          id_catador: dto.id_catador,
          primer_rendimiento: dto.primer_rendimiento,
          segundo_rendimiento: dto.segundo_rendimiento,
          humedad: dto.humedad,
          dano: dto.dano,
          id_calidad: dto.id_calidad,
          observaciones: dto.observaciones,
          usuario_creacion: usuarioId,
          // Inserción anidada (Si el array viene vacío o no viene, Prisma lo ignora gracias al undefined)
          analisis_defectos: dto.defectos && dto.defectos.length > 0 ? {
            create: dto.defectos.map(d => ({
              id_defecto: d.id_defecto,
              cantidad: d.cantidad,
              usuario_creacion: usuarioId
            }))
          } : undefined,
          analisis_zarandas: dto.zarandas && dto.zarandas.length > 0 ? {
            create: dto.zarandas.map(z => ({
              id_zaranda: z.id_zaranda,
              cantidad: z.cantidad,
              usuario_creacion: usuarioId
            }))
          } : undefined,
          analisis_tazas: dto.tazas && dto.tazas.length > 0 ? {
            create: dto.tazas.map(t => ({
              id_tazas: t.id_tazas,
              cantidad: t.cantidad,
              usuario_creacion: usuarioId
            }))
          } : undefined,
        }
      });

      // B. Cambiamos el estado de la carga para que viaje virtualmente a Gerencia
      await tx.detalleRecepcion.update({
        where: { id_detalle_recepcion: dto.id_detalle_recepcion },
        data: {
          id_estado_transaccion: estadoDestino.id_estado_transaccion,
          usuario_modificacion: usuarioId,
          fecha_modificacion: new Date(),
        }
      });

      return analisis;
    });

    this.notifications.emitNotification('new_notification', {
      title: 'Análisis de Laboratorio Completado',
      message: `Se registraron resultados para ${correlativo}. Esperando veredicto de Gerencia.`,
      type: 'warning',
      module: 'RECEPCION'
    });

    return resultado;
  }

  // 2. VEREDICTO (Desde pantalla de Gerencia)
  async veredictoGerencia(idAnalisis: number, dto: VeredictoGerenciaDto, usuarioId: number) {
    const analisis = await this.prisma.analisisCalidad.findUnique({ where: { id_analisis_calidad: idAnalisis } });
    if (!analisis) throw new NotFoundException('Análisis no encontrado');

    let estadoAnalisisNombre = '';
    let estadoDetalleNombre = '';

    if (dto.veredicto === 'APROBAR') {
      estadoAnalisisNombre = 'Muestra Aprobada';
      estadoDetalleNombre = 'Muestra Aprobada';
    } else if (dto.veredicto === 'SEGUNDA_MUESTRA') {
      estadoAnalisisNombre = 'Muestra Rechazada'; // Se rechaza este análisis en específico (historial)
      estadoDetalleNombre = 'Pendiente de Muestrear'; // La carga física regresa al patio para nuevo muestreo
    } else if (dto.veredicto === 'DEVOLUCION') {
      estadoAnalisisNombre = 'Muestra Rechazada';
      estadoDetalleNombre = 'Muestra Rechazada';
    } else {
      throw new InternalServerErrorException('Veredicto inválido');
    }

    const estadoAnalisis = await this.prisma.estadoTransaccion.findUnique({ where: { nombre: estadoAnalisisNombre } });
    const estadoDetalle = await this.prisma.estadoTransaccion.findUnique({ where: { nombre: estadoDetalleNombre } });

    if (!estadoAnalisis || !estadoDetalle) throw new InternalServerErrorException(`Uno o más estados de transacción no fueron encontrados en BD`);

    const resultado = await this.prisma.$transaction(async (tx) => {
      const nuevaObs = dto.observaciones ? `${analisis.observaciones || ''}\n[Gerencia]: ${dto.observaciones}` : analisis.observaciones;
      
      // Actualizar el Análisis
      await tx.analisisCalidad.update({
        where: { id_analisis_calidad: idAnalisis },
        data: { id_estado_transaccion: estadoAnalisis.id_estado_transaccion, observaciones: nuevaObs, usuario_modificacion: usuarioId, fecha_modificacion: new Date() }
      });

      // Actualizar la Carga en Patio
      await tx.detalleRecepcion.update({
        where: { id_detalle_recepcion: analisis.id_detalle_recepcion },
        data: { id_estado_transaccion: estadoDetalle.id_estado_transaccion, usuario_modificacion: usuarioId, fecha_modificacion: new Date() }
      });

      return { success: true, estado: estadoDetalleNombre };
    });

    this.notifications.emitNotification('new_notification', {
      title: 'Veredicto de Gerencia Tomado',
      message: `El análisis ${analisis.numero_analisis} fue dictaminado como: ${estadoAnalisisNombre}.`,
      type: dto.veredicto === 'APROBAR' ? 'success' : 'error',
      module: 'RECEPCION'
    });

    return resultado;
  }

  // 3. LISTAR PARA GERENCIA (Extrae solo los que ocupan autorización)
  async findAllPendientes() {
    return this.prisma.analisisCalidad.findMany({
      where: { estado_transaccion: { nombre: 'Muestra Previa Pendiente de Aprobacion' } },
      include: {
        detalle_recepcion: { include: { proveedor: true, recepcion: true, estado_transaccion: true } },
        catador: true, calidad: true, estado_transaccion: true,
        analisis_defectos: { include: { defecto: true } },
        analisis_zarandas: { include: { zaranda: true } },
        analisis_tazas: { include: { taza: true } }
      },
      orderBy: { fecha_analisis: 'desc' }
    });
  }
}