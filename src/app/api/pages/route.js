// import { S3Client } from '@aws-sdk/client-s3';
// import { Upload } from '@aws-sdk/lib-storage';
// import { createPage } from '@/app/utils/data/pages';
// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// const prisma = new PrismaClient();

// export async function GET(request) {
//   try {
//       const { searchParams } = new URL(request.url);
//       const fetchAll = searchParams.get('all'); // Check if we want all notifications
//       const id = searchParams.get('id');
      
//       if (id) {
//         const page = await prisma.page.findUnique({
//           where: { id: parseInt(id) },
//         });
  
//         if (!page) {
//           return NextResponse.json({ error: 'Page not found' }, { status: 404 });
//         }
  
//         return NextResponse.json(page, { status: 200 });
//       }

//       let pages;

//       if (fetchAll === 'true') {
//           // Fetch all notifications
//           pages = await prisma.page.findMany({
//               orderBy: {
//                   date: 'desc',
//               },
//           });
//       } else {
//           pages = await prisma.page.findMany({
//             orderBy: {
//                 date: 'desc',
//               },
//           });
//       }

//       return NextResponse.json(pages, { status: 200 });
//   } catch (error) {
//       console.error('Error fetching pages:', error);
//       return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get('featuredImage');

//     if (!file) {
//       return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
//     }

//     const fileName = `images/${Date.now()}_${file.name}`;
    
//     const buffer = Buffer.from(await file.arrayBuffer());
    
//     const target = {
//       Bucket: process.env.S3_BUCKET_NAME,
//       Key: fileName,
//       Body: buffer, // Convert the file to an ArrayBuffer
//       ContentType: file.type,
//     };

//     const parallelUploads3 = new Upload({
//       client: s3,
//       queueSize: 4, // optional concurrency configuration
//       leavePartsOnError: false, // optional manually handle dropped parts
//       params: target,
//     });

//     parallelUploads3.on('httpUploadProgress', (progress) => {
//       console.log(progress);
//     });

//     await parallelUploads3.done();

//     const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

//     const pageData = {
//       title: formData.get('title'),
//       slug: formData.get('slug'),
//       content: formData.get('content'),
//       featuredImage: imageUrl,
//     };

//     // First, create the page
//     const page = await prisma.page.create({
//       data: pageData,
//     });

//     console.log('Page Data', page);

//     // Handle the components
//     const componentsData = formData.get('components'); // Components should be sent as JSON
//     console.log('Components Data', componentsData);
//     if (componentsData) {
//       const components = JSON.parse(componentsData); // Parse the JSON string
//       console.log('Components', components);

//       for (let component of components) {

//         console.log('Component', component);
//         await prisma.component.create({
//           data: {
//             type: component.type,
//             props: component.props, // Store the component's props
//             order: component.order || 0, // Optional: provide the order
//             pageId: page.id, // Link the component to the newly created page
//           },
//         });
//       }
//     }

//     return new Response(JSON.stringify(page), { status: 200 });
//   } catch (error) {
//     console.error('Error creating new page:', error);
//     return new Response(JSON.stringify({ error: 'Error creating page' }), {
//       status: 500,
//     });
//   }
// }

// // export async function POST(req) {
// //   try {
// //     const formData = await req.formData();

// //     const primaryColor = formData.get('primaryColor');
// //     const secondaryColor = formData.get('secondaryColor');
// //     const backgroundColor = formData.get('backgroundColor');
// //     const fontFamily = formData.get('fontFamily');
// //     const customCss = formData.get('customCss');
// //     const typographySettings = formData.get('typographySettings');
// //     const socialMediaLinks = formData.get('socialMediaLinks');
// //     const footerText = formData.get('footerText');

// //     let logoUrl = '';
// //     let faviconUrl = '';

// //     // Handle logo file upload
// //     const logoFile = formData.get('logoFile');
// //     if (logoFile) {
// //       const fileName = `logos/${Date.now()}_${logoFile.name}`;
// //       const buffer = Buffer.from(await logoFile.arrayBuffer());

// //       const uploadParams = {
// //         Bucket: process.env.S3_BUCKET_NAME,
// //         Key: fileName,
// //         Body: buffer,
// //         ContentType: logoFile.type,
// //       };

// //       const parallelUploads3 = new Upload({
// //         client: s3,
// //         queueSize: 4,
// //         leavePartsOnError: false,
// //         params: uploadParams,
// //       });

// //       parallelUploads3.on('httpUploadProgress', (progress) => {
// //         console.log(progress);
// //       });

// //       await parallelUploads3.done();

// //       logoUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
// //     }

// //     // Handle favicon file upload
// //     const faviconFile = formData.get('faviconFile');
// //     if (faviconFile) {
// //       const fileName = `favicons/${Date.now()}_${faviconFile.name}`;
// //       const buffer = Buffer.from(await faviconFile.arrayBuffer());

// //       const uploadParams = {
// //         Bucket: process.env.S3_BUCKET_NAME,
// //         Key: fileName,
// //         Body: buffer,
// //         ContentType: faviconFile.type,
// //       };

// //       const parallelUploads3 = new Upload({
// //         client: s3,
// //         queueSize: 4,
// //         leavePartsOnError: false,
// //         params: uploadParams,
// //       });

// //       parallelUploads3.on('httpUploadProgress', (progress) => {
// //         console.log(progress);
// //       });

// //       await parallelUploads3.done();

// //       faviconUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
// //     }

// //     // Upsert settings in the database
// //     const settings = await prisma.themeSettings.upsert({
// //       where: { id: 1 },
// //       update: {
// //         primaryColor,
// //         secondaryColor,
// //         backgroundColor,
// //         fontFamily,
// //         logoUrl: logoUrl || undefined,
// //         faviconUrl: faviconUrl || undefined,
// //         customCss,
// //         typographySettings,
// //         socialMediaLinks,
// //         footerText,
// //       },
// //       create: {
// //         primaryColor,
// //         secondaryColor,
// //         backgroundColor,
// //         fontFamily,
// //         logoUrl,
// //         faviconUrl,
// //         customCss,
// //         typographySettings,
// //         socialMediaLinks,
// //         footerText,
// //       },
// //     });

// //     return NextResponse.json(settings, { status: 200 });
// //   } catch (error) {
// //     console.error('Failed to update settings:', error);
// //     return NextResponse.json({ error: 'Failed to update settings', details: error.message }, { status: 500 });
// //   }
// // }

// // export async function PUT(req, { params }) {
// //   try {
// //     const { id } = params;
// //     const body = await req.json();
// //     const updatedPage = await updatePage(id, body);
// //     return new Response(JSON.stringify(updatedPage), { status: 200 });
// //   } catch (error) {
// //     console.error(error);
// //     return new Response(JSON.stringify({ error: 'Error updating page' }), {
// //       status: 500,
// //     });
// //   }
// // }
// export async function PUT(req) {
//   const { searchParams } = new URL(req.url);
//   const id = searchParams.get('id');

//   try {
//     const formData = await req.formData();
//     const title = formData.get('title');
//     const slug = formData.get('slug');
//     const content = formData.get('content');
//     const componentsData = JSON.parse(formData.get('components')); // The components should be passed as a JSON string

//     let featuredImageUrl = null;
//     const imageFile = formData.get('featuredImage');

//     if (imageFile && imageFile.size > 0) {
//       const upload = new Upload({
//         client: s3,
//         params: {
//           Bucket: process.env.S3_BUCKET_NAME,
//           Key: `logos/${id}-${Date.now()}.png`,
//           Body: imageFile.stream(),
//           ContentType: imageFile.type,
//         },
//       });
//       const { Location } = await upload.done();
//       console.log('Uploaded image:', Location);
//       featuredImageUrl = Location;
//     } else {
//       // Retain the existing image URL if no new one is uploaded
//       const existingPage = await prisma.page.findUnique({
//         where: { id: parseInt(id) },
//       });
//       featuredImageUrl = existingPage.featuredImage;
//     }

//     // Update the page details
//     const updatedPage = await prisma.page.update({
//       where: { id: parseInt(id) },
//       data: {
//         title,
//         slug,
//         content,
//         featuredImage: featuredImageUrl,
//       },
//     });
       

//     return NextResponse.json(updatedPage, { status: 200 });
//   } catch (error) {
//     console.error('Error updating page:', error);
//     return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
//   }
// }


// export async function DELETE(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');

//     if (!id) {
//       return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
//     }

//     await prisma.page.delete({
//       where: { id: parseInt(id) },
//     });

//     return NextResponse.json({ message: 'Page deleted successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error deleting page:', error);
//     return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
//   }
// }



import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET request - Fetch pages or a single page by id or slug
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const slug = searchParams.get('slug');

  try {
    if (id) {
      const page = await prisma.page.findUnique({
        where: { id: parseInt(id) },
        include: { components: true }, // Include components
      });
      if (!page) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      }
      return NextResponse.json(page);
    } else if (slug) {
      const page = await prisma.page.findUnique({
        where: { slug },
        include: { components: true },
      });
      if (!page) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      }
      return NextResponse.json(page);
    } else {
      const pages = await prisma.page.findMany({
        include: { components: true },
      });
      return NextResponse.json(pages);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pages', details: error.message }, { status: 500 });
  }
}

// POST request - Create a new page
export async function POST(req) {
  try {
    const data = await req.json();
    const newPage = await prisma.page.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        featuredImage: data.featuredImage || '',
      },
    });
    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create page', details: error.message }, { status: 500 });
  }
}

// PUT request - Update an existing page
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing page id' }, { status: 400 });

  try {
    const data = await req.json();
    const updatedPage = await prisma.page.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        featuredImage: data.featuredImage,
      },
    });
    return NextResponse.json(updatedPage);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update page', details: error.message }, { status: 500 });
  }
}

// DELETE request - Delete an existing page
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing page id' }, { status: 400 });

  try {
    await prisma.page.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Page deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete page', details: error.message }, { status: 500 });
  }
}
