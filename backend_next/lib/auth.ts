import jwt from "jsonwebtoken";

export type AuthTokenPayload = {
  sub: string;
  usuario: string;
  roles: string[];
};

export function signAccessToken(payload: AuthTokenPayload): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET no está configurado.");
  }

  return jwt.sign(payload, secret, { expiresIn: "8h" });
}
