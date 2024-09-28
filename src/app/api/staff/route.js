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
      const staff = await prisma.staff.findUnique({
        where: { id: parseInt(id) },
        include: { department: true }, // Include department details
      });
      if (!staff) {
        return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
      }
      return NextResponse.json(staff, { status: 200 });
    } else {
      const staffMembers = await prisma.staff.findMany({
        include: { department: true }, // Include department details
      });
      return NextResponse.json(staffMembers, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const title = formData.get('title');
    const departmentId = parseInt(formData.get('departmentId'));
    const email = formData.get('email');
    const phone = formData.get('phone');
    const biography = formData.get('biography');

    let profileImageUrl = '';

    if (formData.get('profileImage')) {
      const profileImageFile = formData.get('profileImage');
      const profileImageUpload = await new Upload({
        client: s3,
        params: {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `profiles/${profileImageFile.name}`,
          Body: profileImageFile.stream(),
        },
      }).done();
      profileImageUrl = `https://${profileImageUpload.Bucket}.s3.amazonaws.com/${profileImageUpload.Key}`;
    }

    const newStaff = await prisma.staff.create({
      data: {
        firstName,
        lastName,
        title,
        departmentId,
        email,
        phone,
        biography,
        profileImage: profileImageUrl,
      },
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    console.error('Error creating staff member:', error);
    return NextResponse.json({ error: 'Failed to create staff member' }, { status: 500 });
  }
}

export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    const formData = await req.formData();

    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const title = formData.get('title');
    const departmentId = parseInt(formData.get('departmentId'));
    const email = formData.get('email');
    const phone = formData.get('phone');
    const biography = formData.get('biography');

    let profileImageUrl = null;
    const profileImageFile = formData.get('profileImage');

    if (profileImageFile && profileImageFile.size > 0) {
      const upload = new Upload({
        client: s3,
        params: {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `profiles/${id}-${Date.now()}.png`,
          Body: profileImageFile.stream(),
          ContentType: profileImageFile.type,
        },
      });
      const { Location } = await upload.done();
      profileImageUrl = Location;
    } else {
      // If no new profile image is uploaded, retain the existing profile image URL
      const existingStaff = await prisma.staff.findUnique({
        where: { id: parseInt(id) },
      });
      profileImageUrl = existingStaff.profileImage;
    }

    const updatedStaff = await prisma.staff.update({
      where: { id: parseInt(id) },
      data: {
        firstName,
        lastName,
        title,
        departmentId,
        email,
        phone,
        biography,
        profileImage: profileImageUrl,
      },
    });

    return NextResponse.json(updatedStaff, { status: 200 });
  } catch (error) {
    console.error('Error updating staff member:', error);
    return NextResponse.json({ error: 'Failed to update staff member' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    await prisma.staff.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Staff member deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    return NextResponse.json({ error: 'Failed to delete staff member' }, { status: 500 });
  }
}

// Handle unsupported methods
export async function middleware(req) {
  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}
