import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; 
import { CreateReceptionDto } from './dto/create-reception.dto';
import { UpdateReceptionDto } from './dto/update-reception.dto';

@Injectable()
export class ReceptionService {
  constructor(private prisma: PrismaService) {}

  // 1. CREAR (Incluye Usuario ID del Guardián)
  async create(dto: CreateReceptionDto, usuarioId: number) {
    const count = await this.prisma.recepcion.count();
    const correlativo = `REC-${String(count + 1).padStart(5, '0')}`;

    return this.prisma.recepcion.create({
      data: {
        numero_entrada: correlativo,
        tipo_vehiculo: dto.tipo_vehiculo,
        placa_vehiculo: dto.placa_vehiculo,
        placa_furgon: dto.placa_furgon,
        transportista: dto.transportista,
        conductor: dto.conductor,
        procedencia: dto.procedencia,
        marchamos: dto.marchamos,
        estado: true,
        // Relación con Usuario
        usuario_id: usuarioId,
        id_sucursal: 1, // TODO: Obtener dinámicamente según el usuario o DTO
        // Relación con Detalles (Equivalente al cascade: true)
        detalles: {
          create: dto.detalles,
        },
      },
      include: { detalles: true },
    });
  }

  // 2. LEER TODOS
  findAll() {
    return this.prisma.recepcion.findMany({
      where: { estado: true },
      include: { detalles: true },
      orderBy: { id: 'desc' },
    });
  }

  // 3. LEER UNO
  async findOne(id: number) {
    const recepcion = await this.prisma.recepcion.findUnique({
      where: { id },
      include: { detalles: true },
    });
    if (!recepcion) throw new NotFoundException(`Recepción #${id} no encontrada`);
    return recepcion;
  }

  // 4. RESUMEN DEL DASHBOARD (Optimizado para Prisma)
  async getResumenHoy() {
    const hoy = new Date();
    const inicioDia = new Date(hoy.setHours(0, 0, 0, 0));
    const finDia = new Date(hoy.setHours(23, 59, 59, 999));

    // Conteo de camiones
    const totalCamiones = await this.prisma.recepcion.count({
      where: {
        fecha_hora: { gte: inicioDia, lte: finDia },
        estado: true,
      },
    });

    // Sumas de sacos y QQ usando Aggregate
    const agregados = await this.prisma.recepcionDetalle.aggregate({
      where: {
        recepcion: {
          fecha_hora: { gte: inicioDia, lte: finDia },
          estado: true,
        },
      },
      _sum: {
        cantidad_sacos: true,
        quintales_pergamino: true,
      },
    });

    return {
      camiones: totalCamiones,
      sacos: agregados._sum.cantidad_sacos || 0,
      qq: Number(agregados._sum.quintales_pergamino) || 0,
    };
  }

  // 5. ELIMINAR (Baja Lógica)
  async remove(id: number) {
    await this.findOne(id); // Valida que exista
    return this.prisma.recepcion.update({
      where: { id },
      data: {
        estado: false,
        detalles: {
          updateMany: {
            where: { recepcion_id: id },
            data: { estado: false },
          },
        },
      },
    });
  }

  // 6. ACTUALIZAR (Lógica Maestro-Detalle)
  async update(id: number, dto: UpdateReceptionDto) {
    const { detalles, ...datosEncabezado } = dto;
    await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      // Actualizar encabezado
      const actualizada = await tx.recepcion.update({
        where: { id },
        data: datosEncabezado,
      });

      if (detalles) {
        // Marcamos como inactivos los que no vienen en el nuevo array (Soft delete)
        const idsEntrantes: number[] = detalles.filter(d => d.id !== undefined && d.id !== null) // Filtro de seguridad
        .map(d => d.id as number);
        await tx.recepcionDetalle.updateMany({
          where: {
            recepcion_id: id,
            id: { notIn: idsEntrantes },
          },
          data: { estado: false },
        });

        // Procesar detalles nuevos o existentes
        for (const det of detalles) {
          if (det.id) {
            await tx.recepcionDetalle.update({
              where: { id: det.id },
              data: { ...det, estado: true },
            });
          } else {
            await tx.recepcionDetalle.create({
              data: { ...det, recepcion_id: id },
            });
          }
        }
      }
      return actualizada;
    });
  }
}