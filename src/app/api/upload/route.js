import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { NextRequest, NextResponse } from 'next/server';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type');
    
    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const uploads = [];

      // Loop through all form data entries
      for (const [key, value] of formData.entries()) {
        // Check if the form entry is a file by checking if it has a `stream` method
        if (typeof value.stream === 'function') { 
          const upload = new Upload({
            client: s3,
            params: {
              Bucket: process.env.S3_BUCKET_NAME,
              Key: `uploads/${Date.now()}-${value.name}`, // Generate a unique key for each file
              Body: value.stream(),
            },
          });

          const { Key } = await upload.done();
          const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${Key}`;
          
          // Push the file URL to the uploads array to return later
          uploads.push({ [key]: fileUrl });
        }
      }

      return NextResponse.json({
        message: 'Files uploaded successfully',
        files: uploads, // Return the file URLs to the client
      }, { status: 200 });
    } else {
      throw new Error('Invalid content type. Expected multipart/form-data.');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({
      error: 'Failed to upload files',
      details: error.message,
    }, { status: 500 });
  }
}

// Handle unsupported methods
export async function middleware(req) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}