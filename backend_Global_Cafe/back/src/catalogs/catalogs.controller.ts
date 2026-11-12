import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CreateSimpleCatalogDto } from './dto/create-simple-catalog.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('catalogs')
@ApiBearerAuth()
@UseGuards(AuthGuard) // Protegemos todos los catálogos para que requieran token
@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get('cosechas')
  getCosechas() {
    return this.catalogsService.getCosechas();
  }

  @Post('cosechas')
  createCosecha(@Body() data: any, @Request() req) {
    return this.catalogsService.createCosecha(data, req.user.id);
  }

  @Patch('cosechas/:id')
  updateCosecha(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.catalogsService.updateCosecha(+id, data, req.user.id);
  }

  @Get('proveedores')
  getProveedores() {
    return this.catalogsService.getProveedores();
  }

  @Post('proveedores')
  createProveedor(@Body() data: any, @Request() req) {
    return this.catalogsService.createProveedor(data, req.user.id);
  }

  @Patch('proveedores/:id')
  updateProveedor(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.catalogsService.updateProveedor(+id, data, req.user.id);
  }

  @Get('conductores')
  getConductores() {
    return this.catalogsService.getConductores();
  }

  @Post('conductores')
  createConductor(@Body() data: any, @Request() req) {
    return this.catalogsService.createConductor(data, req.user.id);
  }

  @Patch('conductores/:id')
  updateConductor(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.catalogsService.updateConductor(+id, data, req.user.id);
  }

  @Get('placas-cabezal')
  getPlacasCabezal() {
    return this.catalogsService.getPlacasCabezal();
  }

  @Post('placas-cabezal')
  createPlacaCabezal(@Body() data: any, @Request() req) {
    return this.catalogsService.createPlacaCabezal(data, req.user.id);
  }

  @Patch('placas-cabezal/:id')
  updatePlacaCabezal(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.catalogsService.updatePlacaCabezal(+id, data, req.user.id);
  }

  @Get('placas-furgon')
  getPlacasFurgon() {
    return this.catalogsService.getPlacasFurgon();
  }

  @Post('placas-furgon')
  createPlacaFurgon(@Body() data: any, @Request() req) {
    return this.catalogsService.createPlacaFurgon(data, req.user.id);
  }

  @Patch('placas-furgon/:id')
  updatePlacaFurgon(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.catalogsService.updatePlacaFurgon(+id, data, req.user.id);
  }

  @Get('municipios')
  getMunicipios() {
    return this.catalogsService.getMunicipios();
  }

  @Post('municipios')
  createMunicipio(@Body() data: any, @Request() req) {
    return this.catalogsService.createMunicipio(data, req.user.id);
  }

  @Patch('municipios/:id')
  updateMunicipio(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.catalogsService.updateMunicipio(+id, data, req.user.id);
  }

  @Get('departamentos')
  getDepartamentos() {
    return this.catalogsService.getDepartamentos();
  }

  @Post('departamentos')
  createDepartamento(@Body() data: any, @Request() req) {
    return this.catalogsService.createDepartamento(data, req.user.id);
  }

  @Patch('departamentos/:id')
  updateDepartamento(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.catalogsService.updateDepartamento(+id, data, req.user.id);
  }

  @Get('transportes')
  getTransportes() {
    return this.catalogsService.getTransportes();
  }

  @Post('transportes')
  createTransporte(@Body() data: any, @Request() req) {
    return this.catalogsService.createTransporte(data, req.user.id);
  }

  @Patch('transportes/:id')
  updateTransporte(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.catalogsService.updateTransporte(+id, data, req.user.id);
  }

    // ==========================================
  // CATADORES
  // ==========================================
  @UseGuards(AuthGuard)
  @Get('catadores')
  getCatadores() { return this.catalogsService.getCatadores(); }

  @UseGuards(AuthGuard)
  @Post('catadores')
  createCatador(@Body() dto: CreateSimpleCatalogDto, @Request() req) { 
    return this.catalogsService.createCatador(dto, req.user?.id); 
  }

  @UseGuards(AuthGuard)
  @Patch('catadores/:id')
  updateCatador(@Param('id') id: string, @Body() dto: CreateSimpleCatalogDto, @Request() req) { 
    return this.catalogsService.updateCatador(+id, dto, req.user?.id); 
  }

  @UseGuards(AuthGuard)
  @Delete('catadores/:id')
  deleteCatador(@Param('id') id: string, @Request() req) { 
    return this.catalogsService.deleteCatador(+id, req.user?.id); 
  }

  // ==========================================
  // CALIDAD
  // ==========================================
  @UseGuards(AuthGuard)
  @Get('calidades')
  getCalidades() { return this.catalogsService.getCalidades(); }

  @UseGuards(AuthGuard)
  @Post('calidades')
  createCalidad(@Body() dto: CreateSimpleCatalogDto, @Request() req) { 
    return this.catalogsService.createCalidad(dto, req.user?.id); 
  }

  @UseGuards(AuthGuard)
  @Patch('calidades/:id')
  updateCalidad(@Param('id') id: string, @Body() dto: CreateSimpleCatalogDto, @Request() req) { 
    return this.catalogsService.updateCalidad(+id, dto, req.user?.id); 
  }

  @UseGuards(AuthGuard)
  @Delete('calidades/:id')
  deleteCalidad(@Param('id') id: string, @Request() req) { 
    return this.catalogsService.deleteCalidad(+id, req.user?.id); 
  }

  // ==========================================
  // DEFECTOS
  // ==========================================
  @UseGuards(AuthGuard)
  @Get('defectos')
  getDefectos() { return this.catalogsService.getDefectos(); }

  @UseGuards(AuthGuard)
  @Post('defectos')
  createDefecto(@Body() dto: CreateSimpleCatalogDto, @Request() req) { 
    return this.catalogsService.createDefecto(dto, req.user?.id); 
  }

  @UseGuards(AuthGuard)
  @Patch('defectos/:id')
  updateDefecto(@Param('id') id: string, @Body() dto: CreateSimpleCatalogDto, @Request() req) { 
    return this.catalogsService.updateDefecto(+id, dto, req.user?.id); 
  }

  @UseGuards(AuthGuard)
  @Delete('defectos/:id')
  deleteDefecto(@Param('id') id: string, @Request() req) { 
    return this.catalogsService.deleteDefecto(+id, req.user?.id); 
  }

  // ==========================================
  // ZARANDAS
  // ==========================================
  @UseGuards(AuthGuard)
  @Get('zarandas')
  getZarandas() { return this.catalogsService.getZarandas(); }

  @UseGuards(AuthGuard)
  @Post('zarandas')
  createZaranda(@Body() dto: CreateSimpleCatalogDto, @Request() req) { 
    return this.catalogsService.createZaranda(dto, req.user?.id); 
  }

  @UseGuards(AuthGuard)
  @Patch('zarandas/:id')
  updateZaranda(@Param('id') id: string, @Body() dto: CreateSimpleCatalogDto, @Request() req) { 
    return this.catalogsService.updateZaranda(+id, dto, req.user?.id); 
  }

  @UseGuards(AuthGuard)
  @Delete('zarandas/:id')
  deleteZaranda(@Param('id') id: string, @Request() req) { 
    return this.catalogsService.deleteZaranda(+id, req.user?.id); 
  }

  // ==========================================
  // TAZAS
  // ==========================================
  @UseGuards(AuthGuard)
  @Get('tazas')
  getTazas() { return this.catalogsService.getTazas(); }

  @UseGuards(AuthGuard)
  @Post('tazas')
  createTaza(@Body() dto: CreateSimpleCatalogDto, @Request() req) { 
    return this.catalogsService.createTaza(dto, req.user?.id); 
  }

  @UseGuards(AuthGuard)
  @Patch('tazas/:id')
  updateTaza(@Param('id') id: string, @Body() dto: CreateSimpleCatalogDto, @Request() req) { 
    return this.catalogsService.updateTaza(+id, dto, req.user?.id); 
  }

  @UseGuards(AuthGuard)
  @Delete('tazas/:id')
  deleteTaza(@Param('id') id: string, @Request() req) { 
    return this.catalogsService.deleteTaza(+id, req.user?.id); 
  }

  // ==========================================
  // BODEGAS
  // ==========================================
  @Get('bodegas')
  getBodegas() {
    return this.catalogsService.getBodegas();
  }

  @Post('bodegas')
  createBodega(@Body() payload: any, @Request() req) {
    return this.catalogsService.createBodega(payload, req.user?.id);
  }

  @Patch('bodegas/:id')
  updateBodega(@Param('id') id: string, @Body() payload: any, @Request() req) {
    return this.catalogsService.updateBodega(+id, payload, req.user?.id);
  }

  // ==========================================
  // ESTIBAS
  // ==========================================
  @Get('estibas')
  getEstibas() {
    return this.catalogsService.getEstibas();
  }

  @Post('estibas')
  createEstiba(@Body() payload: any, @Request() req) {
    return this.catalogsService.createEstiba(payload, req.user?.id);
  }

  @Patch('estibas/:id')
  updateEstiba(@Param('id') id: string, @Body() payload: any, @Request() req) {
    return this.catalogsService.updateEstiba(+id, payload, req.user?.id);
  }
}
