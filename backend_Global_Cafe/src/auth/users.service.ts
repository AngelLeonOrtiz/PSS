import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Usuario, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string) {
    return this.prisma.usuario.findFirst({
      where: { usuario: username },
      include: {
        roles: {
          include: {
            rol: true,
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

  async create(data: CreateUserDto): Promise<Usuario> {
    try {
      // 1. Hashear la contraseña
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(data.password, salt);

      // 2. Crear usuario
      return await this.prisma.usuario.create({
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

  async update(id: number, data: UpdateUserDto): Promise<Usuario> {
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

    return this.prisma.usuario.update({
      where: { id },
      data: { ...updateData, ...rest },
      include: { roles: { include: { rol: true } } } // Retornar con roles para confirmar
    });
  }

  async remove(id: number): Promise<Usuario> {
    return this.prisma.usuario.update({
      where: { id },
      data: { activo: false },
    });
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
      estado: user.activo,
    }));
  }
}