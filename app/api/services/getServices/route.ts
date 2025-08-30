// services/getServices/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters from your dashboard filters
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const duration = searchParams.get('duration');
    const showOpenOnly = searchParams.get('showOpenOnly') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const action = searchParams.get('action');

    // If requesting dashboard statistics
    if (action === 'stats') {
      const [
        totalRequests,
        openRequests,
        completedRequests,
        pendingRequests,
        categoryStats
      ] = await Promise.all([
        prisma.serviceRequest.count(),
        
        prisma.serviceRequest.count({
          where: {
            status: {
              in: ['OPEN', 'IN_PROGRESS']
            }
          }
        }),
        
        prisma.serviceRequest.count({
          where: { status: 'COMPLETED' }
        }),
        
        prisma.serviceRequest.count({
          where: { status: 'PENDING' }
        }),
        
        prisma.serviceRequest.groupBy({
          by: ['category'],
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } }
        })
      ]);

      return NextResponse.json({
        success: true,
        stats: {
          total: totalRequests,
          open: openRequests,
          completed: completedRequests,
          pending: pendingRequests,
          categories: categoryStats
        }
      });
    }

    // Build where clause for filtering service requests
    const where: any = {};

    // Status filter
    if (status && status !== 'Status') {
      where.status = status.toUpperCase();
    }

    // Show open only filter (OPEN, PENDING, IN_PROGRESS)
    if (showOpenOnly) {
      if (where.status) {
        // If status is already set, intersect with open statuses
        if (typeof where.status === 'string') {
          // Only include if status is one of the open statuses
          if (!['OPEN', 'PENDING', 'IN_PROGRESS'].includes(where.status)) {
            where.status = '__NO_MATCH__'; // Will match nothing
          }
        } else if (where.status.in) {
          // Intersect arrays
          where.status.in = where.status.in.filter((s: string) =>
            ['OPEN', 'PENDING', 'IN_PROGRESS'].includes(s)
          );
          if (where.status.in.length === 0) {
            where.status = '__NO_MATCH__';
          }
        }
      } else {
        where.status = {
          in: ['OPEN', 'PENDING', 'IN_PROGRESS']
        };
      }
    }

    // Category filter
    if (category && category !== 'Category') {
      where.category = {
        contains: category,
        mode: 'insensitive'
      };
    }

    // Duration filter
    if (duration && duration !== 'Duration') {
      const now = new Date();
      let dateFilter: Date;

      switch (duration) {
        case 'Last 7 days':
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'Last 30 days':
          dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'Last 90 days':
          dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateFilter = new Date(0);
      }

      where.createdAt = {
        gte: dateFilter
      };
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Query service_requests table
    const [serviceRequests, totalCount] = await Promise.all([
      prisma.serviceRequest.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.serviceRequest.count({ where })
    ]);

    // Return as "requests" for dashboard compatibility
    return NextResponse.json({
      success: true,
      requests: serviceRequests,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error querying service_requests:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch service requests',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create new service request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const serviceRequest = await prisma.serviceRequest.create({
      data: body
    });

    return NextResponse.json({
      success: true,
      data: serviceRequest
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating service request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create service request' 
      },
      { status: 500 }
    );
  }
}

// PUT - Update service request
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }
    

    const serviceRequest = await prisma.serviceRequest.update({
      where: { id },
      data: {
        ...updateData,
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
      { 
        success: false, 
        error: 'Failed to update service request' 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete service request
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    await prisma.serviceRequest.delete({
      where: { id: typeof id === 'string' ? id : String(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Service request deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting service request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete service request' 
      },
      { status: 500 }
    );
  }
}

