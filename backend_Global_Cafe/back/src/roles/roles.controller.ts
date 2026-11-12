import { Body, Controller, Get, Param, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  // --- RUTAS DE PERMISOS ---

  @Get('permissions')
  findAllPermissions() {
    return this.rolesService.findAllPermissionsGrouped();
  }

  @Post('permissions')
  createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.rolesService.createPermission(createPermissionDto);
  }

  @Patch('permissions/:id')
  updatePermission(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.rolesService.updatePermission(+id, updatePermissionDto);
  }

  @Patch('permissions/:id/status')
  removePermission(@Param('id') id: string) {
    return this.rolesService.removePermission(+id);
  }

  // --- RUTAS DE ROLES ---

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto, @Request() req) {
    return this.rolesService.create(createRoleDto, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @Request() req) {
    return this.rolesService.update(+id, updateRoleDto, req.user);
  }

  @Patch(':id/status')
  remove(@Param('id') id: string, @Request() req) {
    return this.rolesService.remove(+id, req.user);
  }
}
