-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "usuarios" TEXT NOT NULL,
    "email" TEXT,
    "tipo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "estado" BOOLEAN,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_usuarios_key" ON "Usuarios"("usuarios");
