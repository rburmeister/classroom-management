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

// GET: Fetch single image by ID or all images in a gallery
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const galleryId = searchParams.get('galleryId');

  try {
    if (id) {
      const image = await prisma.image.findUnique({
        where: { id: parseInt(id) },
      });
      if (!image) {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
      }
      return NextResponse.json(image, { status: 200 });
    } else if (galleryId) {
      const images = await prisma.image.findMany({
        where: { galleryId: parseInt(galleryId) },
      });
      return NextResponse.json(images, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Missing galleryId or image id' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

// POST: Add new images to a gallery
export async function POST(req) {
  try {
    const formData = await req.formData();

    const galleryId = parseInt(formData.get('galleryId'));
    const imageFiles = formData.getAll('images');
    let imageUrls = [];

    for (const imageFile of imageFiles) {
      const upload = new Upload({
        client: s3,
        params: {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `photo-galleries/${galleryId}/${Date.now()}-${imageFile.name}`,
          Body: imageFile.stream(),
          ContentType: imageFile.type,
        },
      });
      const { Location } = await upload.done();
      const altText = formData.get('altText') || '';
      imageUrls.push({
        url: Location,
        altText,
        galleryId,
      });
    }

    const newImages = await prisma.image.createMany({
      data: imageUrls,
    });

    return NextResponse.json(newImages, { status: 201 });
  } catch (error) {
    console.error('Error adding images:', error);
    return NextResponse.json({ error: 'Failed to add images' }, { status: 500 });
  }
}

// PUT: Update image details
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    const formData = await req.formData();

    const altText = formData.get('altText') || null;
    const order = parseInt(formData.get('order'), 10) || null;

    const updatedImage = await prisma.image.update({
      where: { id: parseInt(id) },
      data: {
        altText,
        order,
      },
    });

    return NextResponse.json(updatedImage, { status: 200 });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
  }
}

// DELETE: Remove an image by ID
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    // Fetch the image to get the URL
    const image = await prisma.image.findUnique({
      where: { id: parseInt(id) },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // // Extract the S3 key from the URL
    // const s3Key = image.url.split('.com/')[1];

    // // Delete the image from S3
    // await s3.deleteObject({
    //   Bucket: process.env.S3_BUCKET_NAME,
    //   Key: s3Key,
    // }).promise();

    // Delete the image record from the database
    await prisma.image.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}

// Handle unsupported methods
export async function middleware(req) {
  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}
