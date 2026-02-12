import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signAccessToken } from "@/lib/auth";

const loginSchema = z.object({
  usuario: z.string().min(1, "Usuario requerido"),
  password: z.string().min(1, "Contraseña requerida"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Datos inválidos", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { usuario, password } = parsed.data;

    const user = await prisma.usuarios.findUnique({
      where: { usuarios: usuario },
    });

    if (!user || !user.estado) {
      return NextResponse.json({ message: "Credenciales incorrectas" }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user.contrasena);

    if (!validPassword) {
      return NextResponse.json({ message: "Credenciales incorrectas" }, { status: 401 });
    }

    const token = signAccessToken({
      sub: String(user.id),
      usuario: user.usuarios,
      roles: [user.tipo],
    });

    return NextResponse.json({
      token,
      usuario: user.usuarios,
      nombre: user.name,
      email: user.email ?? "",
      roles: [user.tipo],
      permisos: ["*"],
    });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
