import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSimpleCatalogDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}

export class UpdateSimpleCatalogDto extends CreateSimpleCatalogDto {}