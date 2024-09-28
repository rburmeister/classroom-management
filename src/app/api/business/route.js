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
      const business = await prisma.business.findUnique({
        where: { id: parseInt(id) },
      });
      if (!business) {
        return NextResponse.json({ error: 'Business not found' }, { status: 404 });
      }
      return NextResponse.json(business, { status: 200 });
    } else {
      const businesses = await prisma.business.findMany();
      return NextResponse.json(businesses, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json({ error: 'Failed to fetch business' }, { status: 500 });
  }
}

export async function POST(req) {
    try {
        const formData = await req.formData();

        // const formEntries = {};
        // formData.forEach((value, key) => {
        //   // If the value is a File, convert it to a string to avoid logging raw binary data
        //   formEntries[key] = value instanceof File ? 'File: ' + value.name : value;
        // });
    
        // Log all form data entries
       // console.log('Received Form Data:', formEntries);

        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const businessName = formData.get('businessName');
        const description = formData.get('description');
        const website = formData.get('website');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const address = formData.get('address');

        const city = formData.get('city');
        const state = formData.get('state');
        const zipCode = formData.get('zipCode');
        const categoryId = parseInt(formData.get('categoryId'));
        const logo = formData.get('logo');
    
        let logoUrl = '';
        let faviconUrl = '';
    
        if (formData.get('logo')) {
          const logoFile = formData.get('logo');
          const logoUpload = await new Upload({
            client: s3,
            params: {
              Bucket: process.env.S3_BUCKET_NAME,
              Key: `logos/${logoFile.name}`,
              Body: logoFile.stream(),
            },
          }).done();
          logoUrl = `https://${logoUpload.Bucket}.s3.amazonaws.com/${logoUpload.Key}`;
        }
  
  
      const newBusiness = await prisma.business.create({
        data: {
          firstName,
          lastName,
          businessName,
          logo: logoUrl,
          description,
          website,
          email,
          phone,
          address,
          city,
          state,
          zipCode,
          categoryId
        },
      });
  
      return NextResponse.json(newBusiness, { status: 201 });
    } catch (error) {
      console.error('Error creating business:', error);
      return NextResponse.json({ error: 'Failed to create business' }, { status: 500 });
    }
  }

  export async function PUT(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
  
    try {
      const formData = await req.formData();
  
      const firstName = formData.get('firstName');
      const lastName = formData.get('lastName');
      const businessName = formData.get('businessName');
      const description = formData.get('description');
      const website = formData.get('website');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const address = formData.get('address');
      const city = formData.get('city');
      const state = formData.get('state');
      const zipCode = formData.get('zipCode');
      const categoryId = parseInt(formData.get('categoryId'));
  
      let logoUrl = null;
      const logoFile = formData.get('logo');
  
      if (logoFile && logoFile.size > 0) {
        const upload = new Upload({
          client: s3,
          params: {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `logos/${id}-${Date.now()}.png`,
            Body: logoFile.stream(),
            ContentType: logoFile.type,
          },
        });
        const { Location } = await upload.done();
        logoUrl = Location;
      } else {
        // If no new logo is uploaded, retain the existing logo URL
        const existingBusiness = await prisma.business.findUnique({
          where: { id: parseInt(id) },
        });
        logoUrl = existingBusiness.logo;
      }
  
      const updatedBusiness = await prisma.business.update({
        where: { id: parseInt(id) },
        data: {
          firstName,
          lastName,
          businessName,
          logo: logoUrl,
          description,
          website,
          email,
          phone,
          address,
          city,
          state,
          zipCode,
          categoryId,
        },
      });
  
      return NextResponse.json(updatedBusiness, { status: 200 });
    } catch (error) {
      console.error('Error updating business:', error);
      return NextResponse.json({ error: 'Failed to update business' }, { status: 500 });
    }
  }

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    await prisma.business.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Business deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting business:', error);
    return NextResponse.json({ error: 'Failed to delete business' }, { status: 500 });
  }
}

// Handle unsupported methods
export async function middleware(req) {
  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}
