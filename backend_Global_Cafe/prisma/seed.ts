import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 1. Crear Empresa
  const empresa = await prisma.empresa.upsert({
    where: { rtn: '08011990123456' },
    update: {},
    create: {
      nombre: 'Global Café S.A.',
      razon_social: 'Global Café Sociedad Anónima',
      rtn: '08011990123456',
      pais: 'Honduras',
      ciudad: 'Tegucigalpa',
      direccion: 'Colonia Las Lomas',
      telefono: '+504 2233-4455',
      correo: 'contacto@globalcafe.hn',
      moneda_base: 'HNL',
      tipo_cambio_base: 24.50,
      activo: true,
    },
  });

  console.log({ empresa });

  // 2. Configuración Visual de la Empresa
  await prisma.empresaConfiguracionVisual.upsert({
    where: { id_empresa: empresa.id_empresa },
    update: {},
    create: {
      id_empresa: empresa.id_empresa,
      modulo: 'GENERAL',
      tipo_documento: 'ESTANDAR',
      es_configuracion_global: true,
      color_primario: '#f59e0b',
      color_secundario: '#a855f7',
      color_terciario: '#f97316',
      mostrar_logo: true,
    },
  });

  // 3. Crear Sucursal Principal
  const sucursal = await prisma.sucursal.upsert({
    where: { id_empresa_codigo: { id_empresa: empresa.id_empresa, codigo: 'SUC-001' } },
    update: {},
    create: {
      id_empresa: empresa.id_empresa,
      nombre: 'Sucursal Principal',
      codigo: 'SUC-001',
      es_sucursal_principal: true,
      pais: 'Honduras',
      ciudad: 'Tegucigalpa',
      direccion: 'Bulevar Morazán',
      telefono: '+504 2233-4456',
      estado: true,
    },
  });

  // 4. Crear Licencia
  await prisma.licencia.upsert({
    where: { llave: 'LIC-KEY-12345-ABCDE' },
    update: {},
    create: {
      id_sucursal: sucursal.id_sucursal,
      inicio: new Date(),
      final: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      llave: 'LIC-KEY-12345-ABCDE',
      tipo_licencia: 'ENTERPRISE',
      cantidad_usuarios: 50,
      cantidad_areas: 10,
      estado: true,
    },
  });

  // 5. Crear Áreas
  const areaAdmin = await prisma.area.upsert({
    where: { id_sucursal_codigo: { id_sucursal: sucursal.id_sucursal, codigo: 'AREA-ADMIN' } },
    update: {},
    create: {
      id_sucursal: sucursal.id_sucursal,
      nombre: 'Administración',
      codigo: 'AREA-ADMIN',
      tipo_area: 'ADMINISTRATIVA',
      es_area_operativa: false,
      estado: true,
    },
  });

  const areaRecepcion = await prisma.area.upsert({
    where: { id_sucursal_codigo: { id_sucursal: sucursal.id_sucursal, codigo: 'AREA-RECEP' } },
    update: {},
    create: {
      id_sucursal: sucursal.id_sucursal,
      nombre: 'Recepción y Portería',
      codigo: 'AREA-RECEP',
      tipo_area: 'OPERATIVA',
      modulo_principal: 'RECEPCION',
      es_area_operativa: true,
      estado: true,
    },
  });

  // 6. Roles
  const rolAdmin = await prisma.rol.upsert({
    where: { codigo: 'ADMIN' },
    update: {},
    create: {
      codigo: 'ADMIN',
      nombre: 'Administrador',
      descripcion: 'Rol de administrador del sistema',
      es_rol_sistema: true,
      prioridad: 1,
      estado: true,
    },
  });

  const rolOperador = await prisma.rol.upsert({
    where: { codigo: 'OPERADOR' },
    update: {},
    create: {
      codigo: 'OPERADOR',
      nombre: 'Operador de Recepción',
      descripcion: 'Encargado de registrar entradas y salidas',
      es_rol_sistema: false,
      prioridad: 10,
      estado: true,
    },
  });

  // 7. Permisos (Ejemplos)
  const permisoVerUsuarios = await prisma.permiso.upsert({
    where: { codigo: 'VER_USUARIOS' },
    update: {},
    create: {
      codigo: 'VER_USUARIOS',
      modulo: 'SEGURIDAD',
      accion: 'LEER',
      descripcion: 'Permite ver la lista de usuarios',
    },
  });

  // 8. RolPermiso (Asignar permisos a roles)
  await prisma.rolPermiso.upsert({
    where: { id_rol_id_permiso: { id_rol: rolAdmin.id_rol, id_permiso: permisoVerUsuarios.id_permiso } },
    update: {},
    create: {
      id_rol: rolAdmin.id_rol,
      id_permiso: permisoVerUsuarios.id_permiso,
    },
  });

  // 9. Usuarios (y UsuarioRol implícito)
  const adminUser = await prisma.usuario.upsert({
    where: { usuario: 'admin' },
    update: {},
    create: {
      usuario: 'admin',
      clave_hash: hashedPassword,
      nombre_visible: 'Administrador del Sistema',
      correo: 'admin@globalcafe.hn',
      es_administrador: true,
      activo: true,
      roles: {
        create: {
          rol: { connect: { id_rol: rolAdmin.id_rol } },
        },
      },
    },
  });

  const operadorUser = await prisma.usuario.upsert({
    where: { usuario: 'operador' },
    update: {},
    create: {
      usuario: 'operador',
      clave_hash: hashedPassword,
      nombre_visible: 'Juan Pérez',
      correo: 'juan.perez@globalcafe.hn',
      es_administrador: false,
      activo: true,
      roles: {
        create: {
          rol: { connect: { id_rol: rolOperador.id_rol } },
        },
      },
    },
  });

  // 10. Empleados
  await prisma.empleado.upsert({
    where: { codigo_empleado: 'EMP-001' },
    update: {},
    create: {
      id_area: areaAdmin.id_area,
      id_usuario: adminUser.id,
      nombre_completo: 'Administrador del Sistema',
      codigo_empleado: 'EMP-001',
      puesto: 'Gerente de TI',
      estado_laboral: 'ACTIVO',
    },
  });

  // 11. UsuarioArea
  await prisma.usuarioArea.upsert({
    where: { usuario_id_id_area: { usuario_id: adminUser.id, id_area: areaAdmin.id_area } },
    update: {},
    create: {
      usuario_id: adminUser.id,
      id_area: areaAdmin.id_area,
      es_area_principal: true,
      activo: true,
    },
  });

  // 12. LogSistema (Ejemplo inicial)
  await prisma.logSistema.create({
    data: {
      usuario_id: adminUser.id,
      usuario_login: adminUser.usuario,
      nombre_usuario: adminUser.nombre_visible,
      id_accion: 1,
      accion_nombre: 'SEED_DATABASE',
      modulo: 'SISTEMA',
      exito: true,
      fecha_evento: new Date(),
      origen: 'SEED',
    },
  });

  console.log('Seed completado exitosamente.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
