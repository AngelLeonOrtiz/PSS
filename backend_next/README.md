# Backend Next.js + Prisma (Login)

Este backend está pensado para conectarse con el frontend que ya existe en `frontend_Global_Cafe`.

## 1) Instalar dependencias

```bash
cd backend_next
npm install
```

## 2) Variables de entorno

Crea `backend_next/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/global_cafe"
JWT_SECRET="cambia-esto-en-produccion"
```

## 3) Migrar y generar Prisma Client

```bash
npm run prisma:migrate
npm run prisma:generate
```

## 4) Crear usuario inicial (con contraseña hasheada)

Ejemplo de hash para contraseña `1234`:

```bash
node -e "console.log(require('bcryptjs').hashSync('1234', 10))"
```

Inserta ese hash en `contrasena` dentro de tu tabla `Usuarios`.

## 5) Levantar backend

```bash
npm run dev
```

El login quedará disponible en:

- `POST http://localhost:4000/api/auth/login`

Body esperado:

```json
{
  "usuario": "admin",
  "password": "1234"
}
```

## 6) Conectar frontend al backend

En `frontend_Global_Cafe/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

Luego levanta el frontend y prueba el login.

## 7) Siguientes endpoints recomendados

1. `POST /api/auth/refresh`
2. `POST /api/auth/logout`
3. `POST /api/auth/cambiar-clave`
4. `GET /api/auth/me`

Con eso ya tendrás flujo completo para producción.
