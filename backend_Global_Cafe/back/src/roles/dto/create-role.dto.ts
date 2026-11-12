import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  codigo: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty({ required: false })
  descripcion?: string;

  @ApiProperty({ type: [Number], required: false })
  permisos?: number[]; // Array de IDs de permisos seleccionados
}
