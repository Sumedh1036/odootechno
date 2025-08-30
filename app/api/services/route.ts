import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const serviceType = formData.get('serviceType') as string;
    const date = formData.get('serviceTime') as string;
    const detailedIssue = formData.get('detailedIssue') as string;
    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;
    const image = formData.get('image') as File | null;

    // Validate required fields
    if (!name || !serviceType || !date || !detailedIssue) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let imageUrl = null;

    // Handle image upload if present
    if (image && image.size > 0) {
      // You can implement your image upload logic here
      // For example, upload to Cloudinary, AWS S3, or save locally
      // For now, we'll just store the filename
      imageUrl = `uploads/${Date.now()}_${image.name}`;
      
      // Example: Save to public/uploads directory
      // const bytes = await image.arrayBuffer();
      // const buffer = Buffer.from(bytes);
      // await writeFile(`public/uploads/${imageUrl.split('/')[1]}`, buffer);
    }

    // Create service request in database
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        name,
        
        description: description || null,
        serviceType,
        // serviceTime: new Date(date),
        date: new Date(date),
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        image: imageUrl,
        detailedIssue,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        data: serviceRequest,
        message: 'Service request created successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating service request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const serviceRequests = await prisma.serviceRequest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: serviceRequests,
    });

  } catch (error) {
    console.error('Error fetching service requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update service request
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const serviceRequest = await prisma.serviceRequest.update({
      where: { id }, // ✅ matches model definition
      data: {
        status,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: serviceRequest
    });

  } catch (error) {
    console.error('Error updating service request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update service request' },
      { status: 500 }
    );
  }
}
