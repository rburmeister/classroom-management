import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Fetch active notifications
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const fetchAll = searchParams.get('all'); // Check if we want all notifications
        const id = searchParams.get('id');
        
        if (id) {
          const notification = await prisma.notification.findUnique({
            where: { id: parseInt(id) },
          });
    
          if (!notification) {
            return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
          }
    
          return NextResponse.json(notification, { status: 200 });
        }

        let notifications;

        if (fetchAll === 'true') {
            // Fetch all notifications
            notifications = await prisma.notification.findMany({
                orderBy: {
                    startTime: 'desc',
                },
            });
        } else {
            // Fetch active notifications
            notifications = await prisma.notification.findMany({
                where: {
                    startTime: {
                        lte: new Date(),
                    },
                    endTime: {
                        gte: new Date(),
                    },
                },
            });
        }

        return NextResponse.json(notifications, { status: 200 });
    } catch (error) {
        //console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

// POST: Create a new notification
export async function POST(request) {
    try {
      const data = await request.json();
  
      const newNotification = await prisma.notification.create({
        data: {
          title: data.title,          // Adding the title field
          message: data.message,
          url: data.url, 
          pageSlug: data.pageSlug,
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
          backgroundColor: data.backgroundColor,
          textColor: data.textColor,
        },
      });
  
      return NextResponse.json(newNotification, { status: 201 });
    } catch (error) {
      console.error('Error creating notification:', error);
      return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
    }
  }

// PUT: Update an existing notification
export async function PUT(request) {
    try {
      const data = await request.json();
      const { id, ...updateData } = data;
  
      const updatedNotification = await prisma.notification.update({
        where: { id: parseInt(id) },
        data: {
          title: updateData.title,   // Adding the title field
          message: updateData.message,
          url: updateData.url, 
          pageSlug: updateData.pageSlug,
          startTime: new Date(updateData.startTime),
          endTime: new Date(updateData.endTime),
          backgroundColor: updateData.backgroundColor,
          textColor: updateData.textColor,
        },
      });
  
      return NextResponse.json(updatedNotification, { status: 200 });
    } catch (error) {
      console.error('Error updating notification:', error);
      return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
    }
  }

// DELETE: Delete a notification
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    await prisma.notification.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Notification deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
