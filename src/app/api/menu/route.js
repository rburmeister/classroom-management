import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Fetch all menus
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fetchAll = searchParams.get('all');
    const id = searchParams.get('id');
    
    if (id) {
      // Fetch a single menu by ID
      const menu = await prisma.menu.findUnique({
        where: { id: parseInt(id) },
        include: {
          menuItems: true, // Include related menu items
        },
      });

      if (!menu) {
        return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
      }

      return NextResponse.json(menu, { status: 200 });
    }

    let menus;

    if (fetchAll === 'true') {
      // Fetch all menus
      menus = await prisma.menu.findMany({
        include: {
          menuItems: true, // Include related menu items
        },
        orderBy: {
          name: 'asc', // Optional: you can order by any field, e.g., name
        },
      });
    } else {
      // Fetch all menus without the 'all' parameter (can add specific filters if needed)
      menus = await prisma.menu.findMany({
        include: {
          menuItems: true, // Include related menu items
        },
        orderBy: {
          name: 'asc',
        },
      });
    }

    return NextResponse.json(menus, { status: 200 });
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 });
  }
}

// POST: Create a new menu
export async function POST(request) {
  try {
    const data = await request.json();
    const newMenu = await prisma.menu.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
    return NextResponse.json(newMenu, { status: 201 });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json({ error: 'Failed to create menu' }, { status: 500 });
  }
}

// PUT: Update an existing menu
export async function PUT(request) {
  try {
    const { id, name, description, menuItems } = await request.json();

    const parsedMenuId = parseInt(id, 10);

    // Update the menu itself
    const updatedMenu = await prisma.menu.update({
      where: { id: parsedMenuId },
      data: {
        name,
        description,
      },
    });

    // Handle menu items: update existing, create new, and delete removed items
    const existingMenuItemIds = menuItems
      .filter(item => !item.isNew) // Filter out new items
      .map(item => item.id);

    // Delete menu items that are no longer present
    await prisma.menuItem.deleteMany({
      where: {
        menuId: parsedMenuId,
        id: { notIn: existingMenuItemIds }
      }
    });

    // Update or create menu items
    for (const item of menuItems) {
      const itemData = {
        label: item.label,
        url: item.url,
        order: item.order,
        target: item.target,
        icon: item.icon,
        imageUrl: item.imageUrl,
        parentItem: item.parentId ? { connect: { id: item.parentId } } : undefined,
        menu: { connect: { id: parsedMenuId } },
      };

      if (item.isNew) {
        // Create new item
        await prisma.menuItem.create({
          data: itemData,
        });
      } else {
        // Update existing item
        await prisma.menuItem.update({
          where: { id: item.id },
          data: itemData,
        });
      }
    }

    // Optionally, return the updated menu with items included
    const updatedMenuWithItems = await prisma.menu.findUnique({
      where: { id: parsedMenuId },
      include: { menuItems: true },
    });

    return NextResponse.json(updatedMenuWithItems, { status: 200 });
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json({ error: 'Failed to update menu' }, { status: 500 });
  }
}


// DELETE: Delete a menu
export async function DELETE(request) {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
  
      if (!id) {
        return NextResponse.json({ error: 'Menu ID is required' }, { status: 400 });
      }
  
      await prisma.menu.delete({
        where: { id: parseInt(id) },
      });
  
      return NextResponse.json({ message: 'Menu deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error deleting menu:', error);
      return NextResponse.json({ error: 'Failed to delete menu' }, { status: 500 });
    }
  }