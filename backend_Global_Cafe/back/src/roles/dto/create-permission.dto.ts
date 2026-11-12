import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty()
  codigo: string;

  @ApiProperty()
  modulo: string;

  @ApiProperty()
  accion: string;

  @ApiProperty({ required: false })
  descripcion?: string;
}