import { IsString, IsInt, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReceptionDetalleDto {
  @IsOptional() @IsInt() id_detalle_recepcion?: number;
  @IsInt() id_proveedor: number;
  @IsInt() cantidad_sacos: number;
  @IsNumber() cantidad_qq: number;
  @IsString() remision: string;
  @IsOptional() @IsString() observaciones?: string;
}

export class CreateReceptionDto {
  @IsOptional() @IsInt() id_sucursal?: number;
  @IsInt() id_cosecha: number;
  @IsString() tipo_vehiculo: string;
  @IsInt() id_placa_cabezal: number;
  @IsOptional() @IsInt() id_placa_furgon?: number;
  @IsInt() id_conductor: number;
  @IsInt() id_municipio: number;
  @IsOptional() @IsString() marchamo?: string;
  @IsOptional() @IsString() observaciones?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReceptionDetalleDto)
  detalles: CreateReceptionDetalleDto[];
}