import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Usuario, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string) {
    // Seguridad: Evita que Prisma devuelva el primer usuario si llega undefined o vacío
    if (!username) return null; 

    return this.prisma.usuario.findFirst({
      where: { usuario: username },
      include: {
        roles: {
          include: {
            rol: {
              include: {
                permisos: {
                  include: {
                    permiso: true
                  }
                }
              }
            },
          },
        },
        usuario_areas: {
          include: {
            area: true,
          },
        },
      },
    });
  }

  async create(data: CreateUserDto, currentUser: any): Promise<Usuario> {
    try {
      // 1. Hashear la contraseña
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(data.password, salt);

      // 2. Crear usuario
      const newUser = await this.prisma.usuario.create({
        data: {
          usuario: data.usuario,
          clave_hash: hashedPassword,
          nombre_visible: data.nombre,
          correo: data.email,
          activo: true,
          roles: data.rol ? {
            create: {
              rol: {
                connect: { codigo: data.rol }
              }
            }
          } : undefined,
        },
      });

      // Log
      await this.prisma.logSistema.create({
        data: {
          usuario_id: currentUser?.id,
          usuario_login: currentUser?.username,
          nombre_usuario: currentUser?.nombre,
          id_accion: 1, // 1: CREAR
          accion_nombre: 'CREAR',
          tabla_nombre: 'usuario',
          modulo: 'USUARIOS',
          entidad: 'Usuario',
          id_entidad: newUser.id.toString(),
          datos_despues: newUser as any,
          origen: 'BACKEND',
        },
      });

      return newUser;
    } catch (error) {
      // P2002 es el código de Prisma para violación de restricción única (Unique constraint)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('El usuario ya existe');
        }
      }
      console.error(error);
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  async update(id: number, data: UpdateUserDto, currentUser: any): Promise<Usuario> {
    const oldData = await this.prisma.usuario.findUnique({ where: { id } });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, password, nombre, rol, ...rest } = data;
    const updateData: any = {};

    if (email) updateData.correo = email;
    if (nombre) updateData.nombre_visible = nombre;

    // Solo hashear si viene una contraseña nueva
    if (password) {
      const salt = await bcrypt.genSalt();
      updateData.clave_hash = await bcrypt.hash(password, salt);
    }

    // Si viene un rol, actualizamos la relación (esto es una simplificación: borra todos y pone el nuevo)
    if (rol) {
      // Primero eliminamos roles existentes
      await this.prisma.usuarioRol.deleteMany({ where: { usuario_id: id } });
      
      // Preparamos la creación del nuevo rol
      updateData.roles = {
        create: {
          rol: { connect: { codigo: rol } }
        }
      };
    }

    const updatedUser = await this.prisma.usuario.update({
      where: { id },
      data: { ...updateData, ...rest },
      include: { roles: { include: { rol: true } } } // Retornar con roles para confirmar
    });

    // Log
    await this.prisma.logSistema.create({
      data: {
        usuario_id: currentUser?.id,
        usuario_login: currentUser?.username,
        nombre_usuario: currentUser?.nombre,
        id_accion: 2, // 2: EDITAR
        accion_nombre: 'EDITAR',
        tabla_nombre: 'usuario',
        modulo: 'USUARIOS',
        entidad: 'Usuario',
        id_entidad: updatedUser.id.toString(),
        datos_antes: oldData as any,
        datos_despues: updatedUser as any,
        origen: 'BACKEND',
      },
    });

    return updatedUser;
  }

  async remove(id: number, currentUser: any): Promise<Usuario> {
    try {
      const oldData = await this.prisma.usuario.findUnique({ where: { id } });
      if (!oldData) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
  
      const nuevoEstado = !oldData.activo;
      const accion = nuevoEstado ? 'REACTIVAR' : 'DESACTIVAR';
      const idAccion = nuevoEstado ? 4 : 3; // 3: Desactivar, 4: Reactivar
  
      const deletedUser = await this.prisma.usuario.update({
        where: { id },
        data: { activo: nuevoEstado },
      });
  
      // Log
      await this.prisma.logSistema.create({
        data: {
          usuario_id: currentUser?.id,
          usuario_login: currentUser?.username,
          nombre_usuario: currentUser?.nombre,
          id_accion: idAccion,
          accion_nombre: accion,
          tabla_nombre: 'usuario',
          modulo: 'USUARIOS',
          entidad: 'Usuario',
          id_entidad: deletedUser.id.toString(),
          datos_antes: oldData as any,
          datos_despues: deletedUser as any,
          origen: 'BACKEND',
        },
      });
  
      return deletedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error al desactivar/reactivar usuario:', error);
      throw new InternalServerErrorException('Error al cambiar el estado del usuario');
    }
  }

  async findAll() {
    const users = await this.prisma.usuario.findMany({
      select: {
        id: true,
        usuario: true,
        nombre_visible: true,
        correo: true,
        activo: true,
        roles: {
          select: {
            rol: { select: { nombre: true, codigo: true } },
          },
        },
      },
    });

    return users.map((user) => ({
      id: user.id,
      username: user.usuario, // Mapeo para que coincida con la interfaz del frontend
      nombre: user.nombre_visible,
      email: user.correo,
      rol: user.roles.map((r) => r.rol.nombre).join(', ') || 'Sin Rol',
      rolCodigo: user.roles[0]?.rol?.codigo || '',
      estado: user.activo,
    }));
  }
}