import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET /api/shops - Get all shops with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { owner: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ]
    } : {}

    const [shops, total] = await Promise.all([
      prisma.shop.findMany({
        where,
        include: {
          services: true
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.shop.count({ where })
    ])

    return NextResponse.json({
      shops,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching shops:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/shops - Create new shop
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Add adminId to destructure
    const { name, description, services, location, address, owner, phone, email, adminId } = body

    // Validate required fields (add adminId)
    if (!name || !description || !services || !location || !address || !owner || !phone || !email || !adminId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate location coordinates
    if (!location.lat || !location.lng || isNaN(location.lat) || isNaN(location.lng)) {
      return NextResponse.json(
        { error: 'Invalid location coordinates' },
        { status: 400 }
      )
    }

    // Check if shop with same email already exists
    const existingShop = await prisma.shop.findUnique({
      where: { email }
    })

    if (existingShop) {
      return NextResponse.json(
        { error: 'Shop with this email already exists' },
        { status: 409 }
      )
    }

    // Create shop with services in a transaction
    const shop = await prisma.$transaction(async (tx) => {
      // Create the shop (add adminId)
      const newShop = await tx.shop.create({
        data: {
          name,
          description,
          address,
          owner,
          phone,
          email,
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lng),
          adminId: parseInt(adminId, 10),
        }
      })

      // Create services for the shop
      if (services && services.length > 0) {
        await tx.shopService.createMany({
          data: services.map(service => ({
            name: service,
            shopId: newShop.id
          }))
        })
      }

      // Return shop with services
      return await tx.shop.findUnique({
        where: { id: newShop.id },
        include: {
          services: true
        }
      })
    })

    return NextResponse.json({
      message: 'Shop created successfully',
      shop
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating shop:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}