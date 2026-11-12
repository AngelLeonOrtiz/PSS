import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CatalogsService {
  constructor(private prisma: PrismaService) {}

  async getCosechas() {
    return this.prisma.cosecha.findMany({ where: { estado: true } });
  }

  async createCosecha(data: any, userId: number) {
    const existe = await this.prisma.cosecha.findFirst({ where: { cosecha: data.cosecha } });
    if (existe) throw new ConflictException(`La cosecha ${data.cosecha} ya existe.`);

    return this.prisma.$transaction(async (tx) => {
      if (data.cosecha_actual) {
        await tx.cosecha.updateMany({ data: { cosecha_actual: false } }); // Apaga las demás
      }
      return tx.cosecha.create({
        data: { ...data, usuario_creacion: userId },
      });
    });
  }

  async updateCosecha(id: number, data: any, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      if (data.cosecha_actual) {
        await tx.cosecha.updateMany({ data: { cosecha_actual: false } }); // Apaga las demás
      }
      return tx.cosecha.update({
        where: { id_cosecha: id },
        data: { ...data, usuario_modificacion: userId, fecha_modificacion: new Date() },
      });
    });
  }

  async getProveedores() {
    return this.prisma.proveedor.findMany({ where: { estado: true } });
  }
  
  async createProveedor(data: any, userId: number) {
    const orConditions: any[] = [{ nombre: data.nombre }];
    if (data.rtn) orConditions.push({ rtn: data.rtn });

    const existe = await this.prisma.proveedor.findFirst({ where: { OR: orConditions } });
    if (existe) throw new ConflictException('Ya existe un proveedor registrado con ese nombre o RTN.');

    return this.prisma.proveedor.create({
      data: { ...data, usuario_creacion: userId },
    });
  }

  async updateProveedor(id: number, data: any, userId: number) {
    return this.prisma.proveedor.update({
      where: { id_proveedor: id },
      data: { ...data, usuario_modificacion: userId, fecha_modificacion: new Date() },
    });
  }

  async getConductores() {
    return this.prisma.conductor.findMany({ where: { estado: true } });
  }

  async createConductor(data: any, userId: number) {
    if (data.dni) {
      const existeDni = await this.prisma.conductor.findFirst({ where: { dni: data.dni } });
      if (existeDni) throw new ConflictException(`El conductor con DNI ${data.dni} ya está registrado.`);
    }

    const existe = await this.prisma.conductor.findFirst({
      where: { 
        nombre: data.nombre, 
        licencia: data.licencia || null, 
        id_transporte: data.id_transporte 
      }
    });
    if (existe) throw new ConflictException('Este conductor ya está registrado con la misma licencia en esa empresa de transporte.');

    return this.prisma.conductor.create({
      data: { ...data, usuario_creacion: userId },
    });
  }

  async updateConductor(id: number, data: any, userId: number) {
    return this.prisma.conductor.update({
      where: { id_conductor: id },
      data: { ...data, usuario_modificacion: userId, fecha_modificacion: new Date() },
    });
  }

  async getPlacasCabezal() {
    return this.prisma.placaCabezal.findMany({ where: { estado: true } });
  }

  async createPlacaCabezal(data: any, userId: number) {
    const existe = await this.prisma.placaCabezal.findFirst({ where: { placa: data.placa } });
    if (existe) throw new ConflictException(`La placa ${data.placa} ya está registrada.`);

    return this.prisma.placaCabezal.create({
      data: { ...data, usuario_creacion: userId },
    });
  }

  async updatePlacaCabezal(id: number, data: any, userId: number) {
    return this.prisma.placaCabezal.update({
      where: { id_placa_cabezal: id },
      data: { ...data, usuario_modificacion: userId, fecha_modificacion: new Date() },
    });
  }

  async getPlacasFurgon() {
    return this.prisma.placaFurgon.findMany({ where: { estado: true } });
  }

  async createPlacaFurgon(data: any, userId: number) {
    const existe = await this.prisma.placaFurgon.findFirst({ where: { placa: data.placa } });
    if (existe) throw new ConflictException(`La placa ${data.placa} ya está registrada.`);

    return this.prisma.placaFurgon.create({
      data: { ...data, usuario_creacion: userId },
    });
  }

  async updatePlacaFurgon(id: number, data: any, userId: number) {
    return this.prisma.placaFurgon.update({
      where: { id_placa_furgon: id },
      data: { ...data, usuario_modificacion: userId, fecha_modificacion: new Date() },
    });
  }

  async getMunicipios() {
    return this.prisma.municipio.findMany({ 
      where: { estado: true },
      include: { departamento: true } // Incluimos el departamento para mostrar "Danlí, El Paraíso" en el front
    });
  }

  async createMunicipio(data: any, userId: number) {
    const existe = await this.prisma.municipio.findFirst({ where: { nombre: data.nombre, id_departamento: data.id_departamento } });
    if (existe) throw new ConflictException(`El municipio ${data.nombre} ya existe en ese departamento.`);

    return this.prisma.municipio.create({
      data: { ...data, usuario_creacion: userId },
    });
  }

  async updateMunicipio(id: number, data: any, userId: number) {
    return this.prisma.municipio.update({
      where: { id_municipio: id },
      data: { ...data, usuario_modificacion: userId, fecha_modificacion: new Date() },
    });
  }

  // Método general para traer Departamentos (necesario para el select al crear Municipios)
  async getDepartamentos() {
    return this.prisma.departamento.findMany({ where: { estado: true } });
  }

  async createDepartamento(data: any, userId: number) {
    const existe = await this.prisma.departamento.findFirst({ where: { nombre: data.nombre } });
    if (existe) throw new ConflictException(`El departamento ${data.nombre} ya existe.`);

    return this.prisma.departamento.create({
      data: { ...data, usuario_creacion: userId },
    });
  }

  async updateDepartamento(id: number, data: any, userId: number) {
    return this.prisma.departamento.update({
      where: { id_departamento: id },
      data: { ...data, usuario_modificacion: userId, fecha_modificacion: new Date() },
    });
  }

  // Método general para traer Transportistas (necesario para el select al crear Conductores)
  async getTransportes() {
    return this.prisma.transporte.findMany({
      where: { estado: true }
    });
  }

  async createTransporte(data: any, userId: number) {
    const orConditions: any[] = [{ nombre: data.nombre }];
    if (data.rtn) orConditions.push({ rtn: data.rtn });

    const existe = await this.prisma.transporte.findFirst({ where: { OR: orConditions } });
    if (existe) throw new ConflictException('Ya existe una empresa de transporte con ese nombre o RTN.');

    return this.prisma.transporte.create({
      data: { ...data, usuario_creacion: userId },
    });
  }

  async updateTransporte(id: number, data: any, userId: number) {
    return this.prisma.transporte.update({
      where: { id_transporte: id },
      data: { ...data, usuario_modificacion: userId, fecha_modificacion: new Date() },
    });
  }

    // ==========================================
  // CATADORES
  // ==========================================
  async getCatadores() {
    return this.prisma.catador.findMany({ where: { estado: true }, orderBy: { nombre: 'asc' } });
  }

  async createCatador(data: { nombre: string }, userId: number) {
    return this.prisma.catador.create({ data: { ...data, usuario_creacion: userId } });
  }

  async updateCatador(id: number, data: { nombre: string }, userId: number) {
    return this.prisma.catador.update({
      where: { id_catador: id },
      data: { ...data, usuario_modificacion: userId, fecha_modificacion: new Date() }
    });
  }

  async deleteCatador(id: number, userId: number) {
    return this.prisma.catador.update({
      where: { id_catador: id },
      data: { estado: false, usuario_modificacion: userId, fecha_modificacion: new Date() }
    });
  }

  // ==========================================
  // CALIDAD (Grados de Café)
  // ==========================================
  async getCalidades() {
    return this.prisma.calidad.findMany({ where: { estado: true }, orderBy: { nombre: 'asc' } });
  }

  async createCalidad(data: { nombre: string }, userId: number) {
    return this.prisma.calidad.create({ data: { ...data, usuario_creacion: userId } });
  }

  async updateCalidad(id: number, data: { nombre: string }, userId: number) {
    return this.prisma.calidad.update({
      where: { id_calidad: id },
      data: { ...data, usuario_modificacion: userId, fecha_modificacion: new Date() }
    });
  }

  async deleteCalidad(id: number, userId: number) {
    return this.prisma.calidad.update({
      where: { id_calidad: id },
      data: { estado: false, usuario_modificacion: userId, fecha_modificacion: new Date() }
    });
  }

  // ==========================================
  // DEFECTOS
  // ==========================================
  async getDefectos() {
    return this.prisma.defecto.findMany({ where: { estado: true }, orderBy: { nombre: 'asc' } });
  }

  async createDefecto(data: { nombre: string }, userId: number) {
    return this.prisma.defecto.create({ data: { ...data, usuario_creacion: userId } });
  }

  async updateDefecto(id: number, data: { nombre: string }, userId: number) {
    return this.prisma.defecto.update({
      where: { id_defecto: id },
      data: { ...data, usuario_modificacion: userId, fecha_modificacion: new Date() }
    });
  }

  async deleteDefecto(id: number, userId: number) {
    return this.prisma.defecto.update({
      where: { id_defecto: id },
      data: { estado: false, usuario_modificacion: userId, fecha_modificacion: new Date() }
    });
  }

  // ==========================================
  // ZARANDAS (Mallas)
  // ==========================================
  async getZarandas() {
    return this.prisma.zaranda.findMany({ where: { estado: true }, orderBy: { nombre: 'asc' } });
  }

  async createZaranda(data: { nombre: string }, userId: number) {
    return this.prisma.zaranda.create({ data: { ...data, usuario_creacion: userId } });
  }

  async updateZaranda(id: number, data: { nombre: string }, userId: number) {
    return this.prisma.zaranda.update({
      where: { id_zaranda: id },
      data: { ...data, usuario_modificacion: userId, fecha_modificacion: new Date() }
    });
  }

  async deleteZaranda(id: number, userId: number) {
    return this.prisma.zaranda.update({
      where: { id_zaranda: id },
      data: { estado: false, usuario_modificacion: userId, fecha_modificacion: new Date() }
    });
  }

  // ==========================================
  // TAZAS (Atributos Sensoriales)
  // ==========================================
  async getTazas() {
    return this.prisma.taza.findMany({ where: { estado: true }, orderBy: { nombre: 'asc' } });
  }

  async createTaza(data: { nombre: string }, userId: number) {
    return this.prisma.taza.create({ data: { ...data, usuario_creacion: userId } });
  }

  async updateTaza(id: number, data: { nombre: string }, userId: number) {
    return this.prisma.taza.update({
      where: { id_tazas: id }, // Ojo que en tu Prisma está como id_tazas
      data: { ...data, usuario_modificacion: userId, fecha_modificacion: new Date() }
    });
  }

  async deleteTaza(id: number, userId: number) {
    return this.prisma.taza.update({
      where: { id_tazas: id },
      data: { estado: false, usuario_modificacion: userId, fecha_modificacion: new Date() }
    });
  }

  // ==========================================
  // BODEGAS
  // ==========================================
  async getBodegas() {
    return this.prisma.bodega.findMany({
      orderBy: { nombre: 'asc' }
    });
  }

  async createBodega(data: any, userId: number) {
    return this.prisma.bodega.create({
      data: { ...data, usuario_creacion: userId }
    });
  }

  async updateBodega(id: number, data: any, userId: number) {
    return this.prisma.bodega.update({
      where: { id_bodega: id },
      data: { ...data, usuario_modificacion: userId, fecha_modificacion: new Date() }
    });
  }

  // ==========================================
  // ESTIBAS
  // ==========================================
  async getEstibas() {
    return this.prisma.estiba.findMany({
      include: { bodega: true },
      orderBy: { nombre: 'asc' }
    });
  }

  async createEstiba(data: any, userId: number) {
    return this.prisma.estiba.create({
      data: { ...data, usuario_creacion: userId }
    });
  }

  async updateEstiba(id: number, data: any, userId: number) {
    return this.prisma.estiba.update({
      where: { id_estibas: id },
      data: { ...data, usuario_modificacion: userId, fecha_modificacion: new Date() }
    });
  }
}