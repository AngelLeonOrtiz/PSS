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

  console.log('Seed base completado. Iniciando Seed de Catálogos Operativos...');

  // Reutilizamos el ID del usuario admin creado en el paso 9
  const idUsuario = adminUser.id;

  // 13. Estados de Transacción (Vital para el flujo)
  const estados = [
    'Pendiente de Muestrear', 'Muestra Previa Recibida', 'Muestra Previa Ingresada',
    'Muestra Previa Pendiente de Aprobacion', 'Muestra Aprobada', 'Muestra Rechazada',
    'Pesada Abierta', 'Pesada Cerrada', 'Sin Cabezal', 'Muestra General Recibida',
    'Muestra General Ingresada', 'Muestra General Pendiente de Aprobacion', 
    'Muestra General Aprobada', 'Descuento Por Calidad', 'Descuento Por Peso', 
    'Descuento Por Daño', 'Descuento Por Humedad'
  ];

  for (const nombre of estados) {
    await prisma.estadoTransaccion.upsert({
      where: { nombre },
      update: {},
      create: { nombre, usuario_creacion: idUsuario }
    });
  }
  console.log('✅ Estados de Transacción insertados.');

  // 14. Cosechas
  await prisma.cosecha.upsert({
    where: { cosecha: '2023-2024' }, update: {}, create: { cosecha: '2023-2024', cosecha_actual: false, usuario_creacion: idUsuario }
  });
  await prisma.cosecha.upsert({
    where: { cosecha: '2024-2025' }, update: { cosecha_actual: true }, create: { cosecha: '2024-2025', cosecha_actual: true, usuario_creacion: idUsuario }
  });
  console.log('✅ Cosechas insertadas.');

  // Solo insertamos datos operativos de prueba si la base está limpia de Departamentos
  const deptosCount = await prisma.departamento.count();
  if (deptosCount === 0) {
    // 15. Departamentos y Municipios
    const deptoParaiso = await prisma.departamento.create({ data: { nombre: 'El Paraíso', usuario_creacion: idUsuario } });
    const muniDanli = await prisma.municipio.create({ data: { nombre: 'Danlí', id_departamento: deptoParaiso.id_departamento, usuario_creacion: idUsuario } });

    const deptoComayagua = await prisma.departamento.create({ data: { nombre: 'Comayagua', usuario_creacion: idUsuario } });
    const muniComayagua = await prisma.municipio.create({ data: { nombre: 'Comayagua', id_departamento: deptoComayagua.id_departamento, usuario_creacion: idUsuario } });
    console.log('✅ Departamentos y Municipios insertados.');

    // 16. Proveedores
    await prisma.proveedor.create({ data: { nombre: 'Productor Juan Pérez', rtn: '07031980123454', id_municipio: muniDanli.id_municipio, telefono: '9999-9999', usuario_creacion: idUsuario } });
    await prisma.proveedor.create({ data: { nombre: 'Finca El Puente', rtn: '03011990111111', id_municipio: muniComayagua.id_municipio, telefono: '8888-8888', usuario_creacion: idUsuario } });
    console.log('✅ Proveedores insertados.');

    // 17. Transporte y Conductores
    const transporte = await prisma.transporte.create({ data: { nombre: 'Transportes Rápidos S.A.', id_municipio: muniDanli.id_municipio, usuario_creacion: idUsuario } });
    await prisma.conductor.create({ data: { nombre: 'Carlos Martínez', licencia: '0703-1980-00123', id_transporte: transporte.id_transporte, id_municipio: muniDanli.id_municipio, usuario_creacion: idUsuario } });
    console.log('✅ Transporte y Conductores insertados.');

    // 18. Bodegas y Estibas
    const bodegaIn = await prisma.bodega.create({ data: { nombre: 'Bodega Principal A', externa: false, usuario_creacion: idUsuario } });
    await prisma.estiba.create({ data: { nombre: 'Estiba A-1', id_bodega: bodegaIn.id_bodega, usuario_creacion: idUsuario } });
    await prisma.estiba.create({ data: { nombre: 'Estiba A-2', id_bodega: bodegaIn.id_bodega, usuario_creacion: idUsuario } });
    console.log('✅ Bodegas y Estibas insertadas.');

    // 19. Laboratorio (Catadores, Calidad, etc)
    await prisma.catador.create({ data: { nombre: 'Ana López (Catador Q)', usuario_creacion: idUsuario } });
    await prisma.calidad.create({ data: { nombre: 'Estrictamente Altura (SHG)', usuario_creacion: idUsuario } });
    await prisma.defecto.create({ data: { nombre: 'Grano Negro', usuario_creacion: idUsuario } });
    await prisma.defecto.create({ data: { nombre: 'Brocado Severo', usuario_creacion: idUsuario } });
    await prisma.zaranda.create({ data: { nombre: 'Zaranda 15', usuario_creacion: idUsuario } });
    await prisma.taza.create({ data: { nombre: 'Taza Limpia', usuario_creacion: idUsuario } });
    console.log('✅ Catálogos de Laboratorio insertados.');
  }

  // 20. Placas (Tienen constraint Unique)
  await prisma.placaCabezal.upsert({ where: { placa: 'HAA-1234' }, update: {}, create: { placa: 'HAA-1234', usuario_creacion: idUsuario } });
  await prisma.placaFurgon.upsert({ where: { placa: 'TC-9999' }, update: {}, create: { placa: 'TC-9999', usuario_creacion: idUsuario } });
  console.log('✅ Placas insertadas.');

  console.log('🎉 Todo el Seed completado exitosamente.');
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
