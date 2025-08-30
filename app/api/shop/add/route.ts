import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = authHeader.split(" ")[1];
    if (!process.env.JWT_SECRET) return NextResponse.json({ error: "JWT secret not configured" }, { status: 500 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { role: string };
    if (decoded.role !== "admin") return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const { name, description, address, owner, phone, email, latitude, longitude, services } = await req.json();

    // Create shop and related services in a single transaction
    const shop = await prisma.shop.create({
      data: {
        name,
        description,
        address,
        owner,
        phone,
        email,
        latitude,
        longitude,
        services: {
          create: services.map((service: string) => ({ name: service })),
        },
      },
      include: { services: true },
    });

    return NextResponse.json({ shop });
  } catch (error) {
    console.error("Add shop error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
