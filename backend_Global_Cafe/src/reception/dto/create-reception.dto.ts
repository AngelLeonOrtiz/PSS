import { IsString, IsInt, IsNumber, IsOptional, IsArray, ValidateNested, isInt } from 'class-validator';
import { Type } from 'class-transformer';

class CreateReceptionDetalleDto {
  @IsString() numero_remision: string;
  @IsOptional() @IsInt() id?: number;
  @IsString() proveedor: string;
  @IsInt() cantidad_sacos: number;
  @IsNumber() quintales_pergamino: number;
}

export class CreateReceptionDto {
  @IsString() tipo_vehiculo: string;
  @IsString() placa_vehiculo: string;
  @IsOptional() @IsString() placa_furgon?: string;
  @IsString() transportista: string;
  @IsString() conductor: string;
  @IsString() procedencia: string;
  @IsOptional() @IsString() marchamos?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReceptionDetalleDto)
  detalles: CreateReceptionDetalleDto[];
}