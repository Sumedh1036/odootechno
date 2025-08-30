import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "No token" }, { status: 401 });

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    return NextResponse.json({ error: "JWT secret not configured" }, { status: 500 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
