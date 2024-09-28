import { PrismaClient } from '@prisma/client';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const gallery = await prisma.photoGallery.findUnique({
        where: { id: parseInt(id) },
        include: { images: true },
      });
      if (!gallery) {
        return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
      }
      return NextResponse.json(gallery, { status: 200 });
    } else {
      const galleries = await prisma.photoGallery.findMany({
        include: { images: true },
      });
      return NextResponse.json(galleries, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const formData = await req.formData();
  
      const name = formData.get('name');
      const url = formData.get('url');
      const displayType = formData.get('displayType');
      const autoplay = formData.get('autoplay') === 'true';
      const transitionSpeed = parseInt(formData.get('transitionSpeed'), 10);
  
      const imageFiles = formData.getAll('images');
  
      console.log('Image Files:', imageFiles); // Debug: Check the image files
  
      let imageUrls = [];
  
      if (imageFiles.length > 0) {
        for (const imageFile of imageFiles) {
          console.log('Processing image:', imageFile.name); // Debug: Image processing start
  
          const upload = new Upload({
            client: s3,
            params: {
              Bucket: process.env.S3_BUCKET_NAME,
              Key: `photo-galleries/${name}/${Date.now()}-${imageFile.name}`,
              Body: imageFile.stream(), // Use .stream() to handle the file stream
              ContentType: imageFile.type,
            },
          });
  
          const { Location } = await upload.done();
          imageUrls.push({ url: Location });
  
          console.log('Uploaded image URL:', Location); // Debug: Uploaded image URL
        }
      }
  
      const newGallery = await prisma.photoGallery.create({
        data: {
          name,
          url,
          displayType,
          autoplay,
          transitionSpeed,
          images: {
            create: imageUrls,
          },
        },
      });
  
      return NextResponse.json(newGallery, { status: 201 });
    } catch (error) {
      console.error('Error creating photo gallery:', error);
      return NextResponse.json({ error: 'Failed to create photo gallery' }, { status: 500 });
    }
  }
  

export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    const formData = await req.formData();

    const name = formData.get('name');
    const url = formData.get('url');
    const displayType = formData.get('displayType');
    const autoplay = formData.get('autoplay') === 'true';
    const transitionSpeed = parseInt(formData.get('transitionSpeed'), 10);

    const imageFiles = formData.getAll('images');
    let imageUrls = [];

    if (imageFiles.length > 0) {
      for (const imageFile of imageFiles) {
        const upload = new Upload({
          client: s3,
          params: {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `galleries/${name}/${Date.now()}-${imageFile.name}`,
            Body: imageFile.stream(),
            ContentType: imageFile.type,
          },
        });
        const { Location } = await upload.done();
        imageUrls.push({ url: Location });
      }
    }

    const updatedGallery = await prisma.photoGallery.update({
      where: { id: parseInt(id) },
      data: {
        name,
        url,
        displayType,
        autoplay,
        transitionSpeed,
        images: {
          create: imageUrls,
        },
      },
      include: { images: true },
    });

    return NextResponse.json(updatedGallery, { status: 200 });
  } catch (error) {
    console.error('Error updating photo gallery:', error);
    return NextResponse.json({ error: 'Failed to update photo gallery' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    await prisma.photoGallery.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Gallery deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    return NextResponse.json({ error: 'Failed to delete gallery' }, { status: 500 });
  }
}

// Handle unsupported methods
export async function middleware(req) {
  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}
