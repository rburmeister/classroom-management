import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const department = await prisma.department.findUnique({
        where: { id: parseInt(id) },
        include: { staffMembers: true }, // Include staff members details
      });
      if (!department) {
        return NextResponse.json({ error: 'Department not found' }, { status: 404 });
      }
      return NextResponse.json(department, { status: 200 });
    } else {
      const departments = await prisma.department.findMany({
        include: { staffMembers: true }, // Include staff members details
      });
      return NextResponse.json(departments, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching department:', error);
    return NextResponse.json({ error: 'Failed to fetch department' }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const formData = await req.formData();
  
      const name = formData.get('name');
      const email = formData.get('email');
      const phone = formData.get('phone');
  
      // Create the new department record
      const newDepartment = await prisma.department.create({
        data: {
          name,
          email,
          phone,
        },
      });
  
      return NextResponse.json(newDepartment, { status: 201 });
    } catch (error) {
      console.error('Error creating department:', error);
      return NextResponse.json({ error: 'Failed to create department' }, { status: 500 });
    }
  }

  export async function PUT(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
  
    try {
      const formData = await req.formData();
      const name = formData.get('name');
      const email = formData.get('email');
      const phone = formData.get('phone');
  
      const updatedDepartment = await prisma.department.update({
        where: { id: parseInt(id) },
        data: {
          name,
          email,
          phone,
        },
      });
  
      return NextResponse.json(updatedDepartment, { status: 200 });
    } catch (error) {
      console.error('Error updating department:', error);
      return NextResponse.json({ error: 'Failed to update department' }, { status: 500 });
    }
  }
  

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    await prisma.department.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Department deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json({ error: 'Failed to delete department' }, { status: 500 });
  }
}

// Handle unsupported methods
export async function middleware(req) {
  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}
