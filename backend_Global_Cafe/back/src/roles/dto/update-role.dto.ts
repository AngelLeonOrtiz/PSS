import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  // Puedes añadir campos extra específicos de actualización si los necesitas
  estado?: boolean;
}