import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { AnalisisService } from './analisis.service';
import { CreateAnalisisDto, VeredictoGerenciaDto } from './dto/create-analisis.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('analisis')
@ApiBearerAuth()
@Controller('analisis')
export class AnalisisController {
  constructor(private readonly analisisService: AnalisisService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createAnalisisDto: CreateAnalisisDto, @Request() req) {
    return this.analisisService.createAnalisis(createAnalisisDto, req.user?.id);
  }

  @UseGuards(AuthGuard)
  @Get('pendientes')
  findAllPendientes() {
    return this.analisisService.findAllPendientes();
  }

  @UseGuards(AuthGuard)
  @Patch(':id/veredicto')
  veredicto(@Param('id') id: string, @Body() dto: VeredictoGerenciaDto, @Request() req) {
    return this.analisisService.veredictoGerencia(+id, dto, req.user?.id);
  }
}