import { IsInt, IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AnalisisDefectoDto {
  @IsInt() id_defecto: number;
  @IsNumber() cantidad: number;
}

export class AnalisisZarandaDto {
  @IsInt() id_zaranda: number;
  @IsNumber() cantidad: number;
}

export class AnalisisTazaDto {
  @IsInt() id_tazas: number;
  @IsNumber() cantidad: number;
}

export class CreateAnalisisDto {
  @IsInt() id_detalle_recepcion: number;
  @IsString() tipo_analisis: string; // Ej: 'Muestra Previa'
  @IsInt() id_catador: number;
  
  @IsOptional() @IsNumber() primer_rendimiento?: number;
  @IsOptional() @IsNumber() segundo_rendimiento?: number;
  @IsOptional() @IsNumber() humedad?: number;
  @IsOptional() @IsNumber() dano?: number;
  @IsOptional() @IsInt() id_calidad?: number;
  
  @IsOptional() @IsString() observaciones?: string;

  // NUEVO: Arreglos para guardar los detalles
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnalisisDefectoDto)
  defectos?: AnalisisDefectoDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnalisisZarandaDto)
  zarandas?: AnalisisZarandaDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnalisisTazaDto)
  tazas?: AnalisisTazaDto[];
}

export class VeredictoGerenciaDto {
  @IsString() veredicto: string; // 'APROBAR', 'SEGUNDA_MUESTRA', 'DEVOLUCION'
  @IsOptional() @IsString() observaciones?: string;
}
