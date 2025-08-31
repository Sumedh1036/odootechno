import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const userId = Number(request.headers.get("user-id"));
    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "Valid userId missing" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { workHistory: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const shops = await prisma.shop.findMany();

    return NextResponse.json({ user, shops });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, role, selectedShop } = await request.json(); // Removed unused 'user'
    const userId = Number(request.headers.get("user-id"));

    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "Valid userId missing" }, { status: 400 });
    }

    if (!name || !role || !selectedShop) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate selectedShop exists
    const shopExists = await prisma.shop.findUnique({
      where: { id: selectedShop },
    });
    if (!shopExists) {
      return NextResponse.json({ error: `Selected shop with ID ${selectedShop} does not exist` }, { status: 400 });
    }

    // Use a transaction to update user and work history atomically
    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { name, role },
      }),
    ]);
    console.log("Updated user:", updatedUser);

    // Check if a work history exists
    const existingWork = await prisma.mechanicWorkHistory.findFirst({
      where: { userId },
      orderBy: { startDate: "desc" },
    });
    console.log("Existing work history:", existingWork);

    let workHistory;
    if (existingWork) {
      // Update existing work history
      workHistory = await prisma.mechanicWorkHistory.update({
        where: { id: existingWork.id },
        data: {
          shopId: selectedShop, // String, per schema
          startDate: new Date(),
        },
      });
      console.log("Updated work history:", workHistory);
    } else {
      // Create new work history
      workHistory = await prisma.mechanicWorkHistory.create({
        data: {
          userId,
          shopId: selectedShop, // String, per schema
          startDate: new Date(),
        },
      });
      console.log("Created new work history:", workHistory);
    }

    // Fetch updated user for response
    const finalUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { workHistory: { include: { shop: true } } },
    });
    console.log("Final user with work history:", finalUser);

    return NextResponse.json({
      message: "Profile updated!",
      user: finalUser,
    });
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Prevent connection leaks
  }
}