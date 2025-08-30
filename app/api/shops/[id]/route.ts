import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const shop = await prisma.shop.findUnique({
      where: { id: params.id },
      include: {
        services: true
      }
    })

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ shop })
  } catch (error) {
    console.error('Error fetching shop:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, description, services, location, address, owner, phone, email } = body

    const updatedShop = await prisma.$transaction(async (tx) => {
      // Update shop details
      const shop = await tx.shop.update({
        where: { id: params.id },
        data: {
          name,
          description,
          address,
          owner,
          phone,
          email,
          latitude: location ? parseFloat(location.lat) : undefined,
          longitude: location ? parseFloat(location.lng) : undefined,
        }
      })

      // Update services if provided
      if (services) {
        // Delete existing services
        await tx.shopService.deleteMany({
          where: { shopId: params.id }
        })

        // Create new services
        if (services.length > 0) {
          await tx.shopService.createMany({
            data: services.map(service => ({
              name: service,
              shopId: params.id
            }))
          })
        }
      }

      return await tx.shop.findUnique({
        where: { id: params.id },
        include: {
          services: true
        }
      })
    })

    return NextResponse.json({
      message: 'Shop updated successfully',
      shop: updatedShop
    })
  } catch (error) {
    console.error('Error updating shop:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.shop.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Shop deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting shop:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}