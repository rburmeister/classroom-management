import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET request - Fetch components or a single component by id
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const component = await prisma.component.findUnique({
        where: { id: parseInt(id) },
      });
      if (!component) {
        return NextResponse.json({ error: 'Component not found' }, { status: 404 });
      }
      return NextResponse.json(component);
    } else {
      const components = await prisma.component.findMany();
      return NextResponse.json(components);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch components', details: error.message }, { status: 500 });
  }
}

// POST request - Create a new component
export async function POST(req) {
  try {
    const data = await req.json();
    console.log('Create Component Data:', data);
    const newComponent = await prisma.component.create({
      data: {
        type: data.type,
        props: data.props,
      },
    });
    return NextResponse.json(newComponent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create component', details: error.message }, { status: 500 });
  }
}

// PUT request - Update an existing component
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing component id' }, { status: 400 });

  try {
    const data = await req.json();
    const updatedComponent = await prisma.component.update({
      where: { id: parseInt(id) },
      data: {
        type: data.type,
        props: data.props,
      },
    });
    return NextResponse.json(updatedComponent);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update component', details: error.message }, { status: 500 });
  }
}

// DELETE request - Delete an existing component
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing component id' }, { status: 400 });

  try {
    await prisma.component.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Component deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete component', details: error.message }, { status: 500 });
  }
}
