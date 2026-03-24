export class CreateUserDto {
  usuario: string;
  nombre: string;
  email?: string;
  password: string;
  rol?: string; // El frontend envía "rol" como string (ej: "ADMIN")
}
