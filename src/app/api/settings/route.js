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
// GET method to fetch settings
export async function GET(req) {
  try {
    const settings = await prisma.themeSettings.findFirst();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({
      error: {
        message: 'Failed to fetch settings',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    }, { status: 500 });
  }
}

// POST method to update settings
export async function POST(req) {
  try {
    let primaryColor, secondaryColor, backgroundColor, fontFamily, customCss, typographySettings, socialMediaLinks, footerText;
    let headerMenuId, footerMenuId;
    let logoUrl = '';
    let faviconUrl = '';

    const contentType = req.headers.get('content-type');

    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      primaryColor = formData.get('primaryColor');
      secondaryColor = formData.get('secondaryColor');
      backgroundColor = formData.get('backgroundColor');
      fontFamily = formData.get('fontFamily');
      customCss = formData.get('customCss');
      typographySettings = formData.get('typographySettings');
      socialMediaLinks = formData.get('socialMediaLinks');
      footerText = formData.get('footerText');
      headerMenuId = formData.get('headerMenuId');
      footerMenuId = formData.get('footerMenuId');

      if (formData.get('logoFile')) {
        const logoFile = formData.get('logoFile');
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

      if (formData.get('faviconFile')) {
        const faviconFile = formData.get('faviconFile');
        const faviconUpload = await new Upload({
          client: s3,
          params: {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `favicons/${faviconFile.name}`,
            Body: faviconFile.stream(),
          },
        }).done();
        faviconUrl = `https://${faviconUpload.Bucket}.s3.amazonaws.com/${faviconUpload.Key}`;
      }
    } else if (contentType && contentType.includes('application/json')) {
      const body = await req.json();
      primaryColor = body.primaryColor;
      secondaryColor = body.secondaryColor;
      backgroundColor = body.backgroundColor;
      fontFamily = body.fontFamily;
      customCss = body.customCss;
      typographySettings = body.typographySettings;
      socialMediaLinks = body.socialMediaLinks;
      footerText = body.footerText;
      headerMenuId = body.headerMenuId;
      footerMenuId = body.footerMenuId;
    } else {
      throw new Error('Unsupported content type');
    }

    const settings = await prisma.themeSettings.upsert({
      where: { id: 1 }, // Assuming you have a single settings record with id 1
      update: {
        primaryColor,
        secondaryColor,
        backgroundColor,
        fontFamily,
        logoUrl: logoUrl || undefined, // Update only if logoUrl is not empty
        faviconUrl: faviconUrl || undefined, // Update only if faviconUrl is not empty
        customCss,
        typographySettings,
        socialMediaLinks,
        footerText,
        headerMenuId: parseInt(headerMenuId) || null, // Convert to integer or set to null
        footerMenuId: parseInt(footerMenuId) || null, // Convert to integer or set to null
      },
      create: {
        primaryColor,
        secondaryColor,
        backgroundColor,
        fontFamily,
        logoUrl,
        faviconUrl,
        customCss,
        typographySettings,
        socialMediaLinks,
        footerText,
        headerMenuId: parseInt(headerMenuId) || null, // Convert to integer or set to null
        footerMenuId: parseInt(footerMenuId) || null, // Convert to integer or set to null
      },
    });

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Failed to update settings', details: error.message }, { status: 500 });
  }
}

// Handle unsupported methods
export async function middleware(req) {
  if (!['GET', 'POST'].includes(req.method)) {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}
