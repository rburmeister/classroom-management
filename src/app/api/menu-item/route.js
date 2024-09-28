import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Fetch all menu items (optionally filter by menuId)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const menuId = searchParams.get('menuId');

    const menuItems = await prisma.menuItem.findMany({
      where: menuId ? { menuId: parseInt(menuId) } : undefined,
      include: {
        childItems: true, // Include child menu items for nested menus
      },
    });

    return NextResponse.json(menuItems, { status: 200 });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

// POST: Create a new menu item
export async function POST(request) {
  try {
    const data = await request.json();

    const newMenuItem = await prisma.menuItem.create({
      data: {
        menuId: data.menuId,
        parentId: data.parentId || null,
        label: data.label,
        url: data.url,
        order: data.order || 0,
        target: data.target,
        icon: data.icon,
        imageUrl: data.imageUrl,
      },
    });

    return NextResponse.json(newMenuItem, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

// PUT: Update an existing menu item
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(updatedMenuItem, { status: 200 });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

// DELETE: Delete a menu item
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Menu Item ID is required' }, { status: 400 });
    }

    await prisma.menuItem.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Menu item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
