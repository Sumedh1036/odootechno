import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
export async function GET(request: Request) {
  const userId = Number(request.headers.get("id")); // pass from client
  console.log(userId)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { workHistory: { include: { shop: true } } },
  });

  const shops = await prisma.user.findMany({
    where: { role: "admin" } ,
  });

  return NextResponse.json({ user, shops });
}

export async function POST(request: Request) {
  const { name, role, selectedShop } = await request.json();

  

  // Add work history if selected
  if (selectedShop) {
    await prisma.mechanicWorkHistory.create({
      data: {
        shopId: Number(selectedShop),
        startDate: new Date(),
      },
    });
  }

  return NextResponse.json({ message: "Profile updated!" });
}
