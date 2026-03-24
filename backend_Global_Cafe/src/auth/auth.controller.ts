import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.usuario, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Post('refresh')
  refresh(@Request() req) {
    return this.authService.refresh(req.user);
  }

  @Post('logout')
  logout() {
    // En JWT sin estado, el logout se maneja principalmente en el frontend borrando el token.
    // Aquí devolvemos OK para confirmar la acción.
    return { message: 'Sesión cerrada correctamente' };
  }
}