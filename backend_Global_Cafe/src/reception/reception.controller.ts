import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ReceptionService } from './reception.service';
import { CreateReceptionDto } from './dto/create-reception.dto';
import { UpdateReceptionDto } from './dto/update-reception.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'; 

@ApiTags('reception')
@ApiBearerAuth()
@Controller('reception')
export class ReceptionController {
  constructor(private readonly receptionService: ReceptionService) {}

  @UseGuards(AuthGuard) 
  @Post()
  create(@Body() createReceptionDto: CreateReceptionDto, @Request() req) {
    // req.user contiene el payload que tu AuthGuard inyectó
    if (!req.user || !req.user.id) {
       throw new Error('El usuario no está autenticado correctamente o no tiene ID');
    }
    return this.receptionService.create(createReceptionDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.receptionService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('resumen-hoy')
  getResumen() {
    return this.receptionService.getResumenHoy();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receptionService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReceptionDto: UpdateReceptionDto) {
    return this.receptionService.update(+id, updateReceptionDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receptionService.remove(+id);
  }
}