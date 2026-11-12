import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const roles = await this.prisma.rol.findMany({
      where: { estado: true },
      include: {
        _count: {
          select: { usuarios: { where: { activo: true } }, permisos: true }
        }
      },
      orderBy: { id_rol: 'desc' }
    });

    return roles.map(r => ({
      id: r.id_rol,
      codigo: r.codigo,
      nombre: r.nombre,
      descripcion: r.descripcion,
      usuarios: r._count.usuarios,
      permisos: r._count.permisos,
      es_rol_sistema: r.es_rol_sistema,
    }));
  }

  async findOne(id: number) {
    const role = await this.prisma.rol.findUnique({
      where: { id_rol: id },
      include: {
        permisos: {
          select: { id_permiso: true }
        }
      }
    });
    if (!role) throw new NotFoundException('Rol no encontrado');
    
    // Formatear para que sea fácil consumirlo en el frontend
    return {
      id: role.id_rol,
      codigo: role.codigo,
      nombre: role.nombre,
      descripcion: role.descripcion,
      es_rol_sistema: role.es_rol_sistema,
      permisosIds: role.permisos.map(p => p.id_permiso)
    };
  }

  // Agrupa todos los permisos por módulo para usarlos en el frontend
  async findAllPermissionsGrouped() {
    const permisos = await this.prisma.permiso.findMany({
      where: { estado: true },
      orderBy: { modulo: 'asc' }
    });

    const grouped = permisos.reduce((acc, curr) => {
      if (!acc[curr.modulo]) acc[curr.modulo] = [];
      acc[curr.modulo].push({
        id: curr.id_permiso,
        codigo: curr.codigo,
        accion: curr.accion,
        descripcion: curr.descripcion
      });
      return acc;
    }, {} as Record<string, any[]>);

    return Object.keys(grouped).map(modulo => ({
      modulo,
      permisos: grouped[modulo]
    }));
  }

  async create(data: CreateRoleDto, currentUser: any) {
    try {
      return await this.prisma.rol.create({
        data: {
          codigo: data.codigo,
          nombre: data.nombre,
          descripcion: data.descripcion,
          usuario_creacion: currentUser?.id,
          permisos: data.permisos && data.permisos.length > 0 ? {
            create: data.permisos.map(id_permiso => ({
              permiso: { connect: { id_permiso } },
              usuario_asignacion: currentUser?.id
            }))
          } : undefined
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('El código del rol ya existe');
      }
      console.error(error);
      throw new InternalServerErrorException('Error al crear el rol');
    }
  }

  async update(id: number, data: UpdateRoleDto, currentUser: any) {
    const oldRole = await this.prisma.rol.findUnique({ where: { id_rol: id } });
    if (!oldRole) throw new NotFoundException('Rol no encontrado');
    if (oldRole.es_rol_sistema) throw new ConflictException('No se pueden editar los roles críticos del sistema');

    try {
      return await this.prisma.$transaction(async (tx) => {
        const updated = await tx.rol.update({
          where: { id_rol: id },
          data: {
            codigo: data.codigo,
            nombre: data.nombre,
            descripcion: data.descripcion,
            usuario_actualizacion: currentUser?.id,
            fecha_actualizacion: new Date(),
          }
        });

        // Reemplazar permisos si el array fue provisto
        if (data.permisos !== undefined) {
          await tx.rolPermiso.deleteMany({ where: { id_rol: id } }); // Limpiar antiguos
          if (data.permisos.length > 0) {
            await tx.rolPermiso.createMany({
              data: data.permisos.map(id_permiso => ({
                id_rol: id,
                id_permiso,
                usuario_asignacion: currentUser?.id
              }))
            });
          }
        }
        return updated;
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar el rol');
    }
  }

  async remove(id: number, currentUser: any) {
    const oldRole = await this.prisma.rol.findUnique({ where: { id_rol: id } });
    if (!oldRole) throw new NotFoundException('Rol no encontrado');
    if (oldRole.es_rol_sistema) throw new ConflictException('No se pueden eliminar los roles críticos del sistema');
    return this.prisma.rol.update({ where: { id_rol: id }, data: { estado: false, fecha_eliminacion: new Date(), usuario_actualizacion: currentUser?.id } });
  }

  // --- GESTIÓN DE PERMISOS ---

  async createPermission(data: CreatePermissionDto) {
    try {
      return await this.prisma.permiso.create({
        data: {
          codigo: data.codigo,
          modulo: data.modulo,
          accion: data.accion,
          descripcion: data.descripcion,
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('El código del permiso ya existe');
      }
      console.error(error);
      throw new InternalServerErrorException('Error al crear el permiso');
    }
  }

  async updatePermission(id: number, data: UpdatePermissionDto) {
    const oldPermiso = await this.prisma.permiso.findUnique({ where: { id_permiso: id } });
    if (!oldPermiso) throw new NotFoundException('Permiso no encontrado');

    try {
      return await this.prisma.permiso.update({ where: { id_permiso: id }, data });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar el permiso');
    }
  }

  async removePermission(id: number) {
    const oldPermiso = await this.prisma.permiso.findUnique({ where: { id_permiso: id } });
    if (!oldPermiso) throw new NotFoundException('Permiso no encontrado');
    return this.prisma.permiso.update({ where: { id_permiso: id }, data: { estado: false } });
  }
}
