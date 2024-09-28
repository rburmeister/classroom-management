// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // GET request - Fetch components by pageId or a single component by id
// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const id = searchParams.get('id');
//   const pageId = searchParams.get('pageId');

//   try {
//     if (id) {
//       const component = await prisma.component.findUnique({
//         where: { id: parseInt(id) },
//       });

//       if (!component) {
//         return new Response(JSON.stringify({ error: 'Component not found' }), { status: 404 });
//       }

//       return new Response(JSON.stringify(component), { status: 200 });
//     } else if (pageId) {
//       const components = await prisma.component.findMany({
//         where: { pageId: parseInt(pageId) },
//         orderBy: { order: 'asc' }, // Assuming components are ordered
//       });

//       return new Response(JSON.stringify(components), { status: 200 });
//     } else {
//       const components = await prisma.component.findMany();
//       return new Response(JSON.stringify(components), { status: 200 });
//     }
//   } catch (error) {
//     console.error('Error fetching components:', error);
//     return new Response(JSON.stringify({ error: 'Failed to fetch components' }), { status: 500 });
//   }
// }

// // PUT request - Update or create components dynamically
// export async function PUT(req) {
//   const { searchParams } = new URL(req.url);
//   const id = searchParams.get('id');

//   try {
//     const contentType = req.headers.get('content-type') || '';

//     if (contentType.includes('multipart/form-data')) {
//       const formData = await req.formData();
//       let components = [];
//       let updatedProps = {};

//       // Loop through the formData dynamically
//       for (const [key, value] of formData.entries()) {
//         const [componentIndex, fieldName] = key.split('_').slice(1); // Extract component index and field name

//         if (fieldName === 'props') {
//           // Parse the JSON props if it's a regular field
//           updatedProps = JSON.parse(value);
//         } else if (['type', 'pageId', 'order'].includes(fieldName)) {
//           components[componentIndex] = components[componentIndex] || {};
//           components[componentIndex][fieldName] = value;
//         } else {
//           // If it's a regular value, store it directly in props
//           updatedProps[fieldName] = value;
//         }
//       }

//       // Update or create components in the database
//       await Promise.all(
//         components.map(async (component) => {
//           if (component.id) {
//             await prisma.component.update({
//               where: { id: component.id },
//               data: {
//                 type: component.type,
//                 props: updatedProps,
//                 pageId: component.pageId || undefined,
//                 order: component.order || 0,
//               },
//             });
//           } else {
//             await prisma.component.create({
//               data: {
//                 type: component.type,
//                 props: updatedProps,
//                 pageId: parseInt(component.pageId),
//                 order: component.order || 0,
//               },
//             });
//           }
//         })
//       );

//       return new Response(JSON.stringify({ success: true }), { status: 200 });
//     } else if (contentType.includes('application/json')) {
//       const data = await req.json();
//       // Handle JSON update logic here
//       const { components } = data;

//       await Promise.all(
//         components.map(async (component) => {
//           if (component.id) {
//             await prisma.component.update({
//               where: { id: component.id },
//               data: {
//                 type: component.type,
//                 props: component.props,
//                 pageId: component.pageId || undefined,
//                 order: component.order || 0,
//               },
//             });
//           } else {
//             await prisma.component.create({
//               data: {
//                 type: component.type,
//                 props: component.props,
//                 pageId: parseInt(component.pageId),
//                 order: component.order || 0,
//               },
//             });
//           }
//         })
//       );

//       return new Response(JSON.stringify({ success: true }), { status: 200 });
//     }

//     return new Response(JSON.stringify({ error: 'Unsupported Content-Type' }), { status: 400 });
//   } catch (error) {
//     console.error('Error updating component:', error);
//     return new Response(JSON.stringify({ error: 'Failed to update or create component' }), { status: 500 });
//   }
// }

// // POST request - Create new component dynamically
// export async function POST(req) {
//   try {
//     const contentType = req.headers.get('content-type') || '';

//     if (contentType.includes('multipart/form-data')) {
//       const formData = await req.formData();

//       let props = {};
//       formData.forEach((value, key) => {
//         props[key] = value; // Add formData fields to the props object
//       });

//       const pageId = formData.get('pageId'); 

//       const newComponent = await prisma.component.create({
//         data: {
//           type: formData.get('type') || 'hero',
//           props,
//           pageId: parseInt(pageId),
//           order: 0,
//         },
//       });

//       return new Response(JSON.stringify(newComponent), { status: 201 });
//     } else if (contentType.includes('application/json')) {
//       const data = await req.json();
//       const { type, props, pageId } = data;

//       const newComponent = await prisma.component.create({
//         data: {
//           type: type || 'hero',
//           props,
//           pageId: parseInt(pageId),
//           order: 0,
//         },
//       });

//       return new Response(JSON.stringify(newComponent), { status: 201 });
//     }

//     return new Response(JSON.stringify({ error: 'Unsupported Content-Type' }), { status: 400 });
//   } catch (error) {
//     console.error('Error creating component:', error);
//     return new Response(JSON.stringify({ error: 'Failed to create component' }), { status: 500 });
//   }
// }


// // DELETE request - Remove a component
// export async function DELETE(req) {
//   const { searchParams } = new URL(req.url);
//   const id = searchParams.get('id');

//   try {
//     await prisma.component.delete({
//       where: { id: parseInt(id) },
//     });
//     return new Response(JSON.stringify({ message: 'Component deleted successfully' }), { status: 200 });
//   } catch (error) {
//     console.error('Error deleting component:', error);
//     return new Response(JSON.stringify({ error: 'Failed to delete component' }), { status: 500 });
//   }
// }


import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET request - Fetch page components by pageId
// GET request - Fetch components by pageId or a single component by id
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get('pageId');
  const componentId = searchParams.get('componentId'); // Get the componentId

  try {
    if (pageId && componentId) {
      // Check for a specific PageComponent by pageId and componentId
      const pageComponent = await prisma.pageComponent.findUnique({
        where: {
          pageId_componentId: {
            pageId: parseInt(pageId),
            componentId: parseInt(componentId),
          },
        },
        include: {
          component: true, // Include the full Component data
        },
      });

      if (pageComponent) {
        return new Response(JSON.stringify(pageComponent), { status: 200 });
      } else {
        // Return 404 if no PageComponent is found
        return new Response(JSON.stringify({ error: 'PageComponent not found' }), { status: 404 });
      }
    } else if (pageId) {
      // Fetch all components for a given pageId
      const components = await prisma.pageComponent.findMany({
        where: { pageId: parseInt(pageId) },
        include: {
          component: true, // This will include the full Component data
        },
        orderBy: {
          order: 'asc', // Assuming components are ordered by 'order'
        },
      });

      return new Response(JSON.stringify(components), { status: 200 });
    } else {
      // Fetch all components if no specific pageId is provided
      const allComponents = await prisma.pageComponent.findMany({
        include: {
          component: true, // Include full Component data
        },
      });
      return new Response(JSON.stringify(allComponents), { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching components:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch components' }), { status: 500 });
  }
}



// POST request - Add component to page (PageComponent)
// POST request to create a page-component relationship
// POST request to create a page-component relationship
// POST request - Link a page to a component
export async function POST(req) {
  try {
    const data = await req.json();
    const { pageId, componentId, order } = data;

    if (!pageId || !componentId || isNaN(parseInt(pageId)) || isNaN(parseInt(componentId))) {
      return new Response(JSON.stringify({ error: 'Invalid pageId or componentId' }), { status: 400 });
    }

    const newPageComponent = await prisma.pageComponent.create({
      data: {
        pageId: parseInt(pageId),
        componentId: parseInt(componentId),
        order: order || 0, // Ensure an order value
      },
    });

    return new Response(JSON.stringify(newPageComponent), { status: 201 });
  } catch (error) {
    if (error.code === 'P2002') {
      // Unique constraint failed, so update the existing PageComponent
      const { pageId, componentId, order } = await req.json();

      const existingPageComponent = await prisma.pageComponent.update({
        where: {
          pageId_componentId: {
            pageId: parseInt(pageId),
            componentId: parseInt(componentId),
          },
        },
        data: {
          order: order || 0,
        },
      });

      return new Response(JSON.stringify(existingPageComponent), { status: 200 });
    } else {
      console.error('Error creating page-component link:', error);
      return new Response(JSON.stringify({ error: 'Failed to add component to page', details: error.message }), { status: 500 });
    }
  }
}



// PUT request - Update the order of a page component or other data
// export async function PUT(req) {
//   try {
//     const data = await req.json(); // Extract data from the request body
//     const { pageId, componentId, order } = data;

//     console.log('Page Component PUT:', pageId, componentId);

//     if (!pageId || !componentId) {
//       return NextResponse.json({ error: 'Missing pageId or componentId' }, { status: 400 });
//     }

//     // Update the order of the component
//     const updatedPageComponent = await prisma.pageComponent.update({
//       where: {
//         pageId_componentId: {
//           pageId: parseInt(pageId),
//           componentId: parseInt(componentId),
//         },
//       },
//       data: {
//         order: order, // Update the order from the request body
//       },
//     });

//     return NextResponse.json(updatedPageComponent);
//   } catch (error) {
//     console.error('Error updating page component:', error);
//     return NextResponse.json({ error: 'Failed to update page component', details: error.message }, { status: 500 });
//   }
// }

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // Get the pageComponentId from query parameters
    console.log('Page Component PUT:', id);
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const data = await req.json();
    const { order, pageId, componentId } = data;

    if (order === undefined) {
      return NextResponse.json({ error: 'Missing order' }, { status: 400 });
    }

    // Update the order of the component using the id
    const updatedPageComponent = await prisma.pageComponent.update({
        where: {
          pageId_componentId: {
            pageId: parseInt(pageId),
            componentId: parseInt(componentId),
          },
        },
        data: {
          order: order, // Update the order from the request body
        },
      });

    return NextResponse.json(updatedPageComponent);
  } catch (error) {
    console.error('Error updating page component:', error);
    return NextResponse.json(
      { error: 'Failed to update page component', details: error.message },
      { status: 500 }
    );
  }
}

// export async function PUT(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get('id'); // Get the pageComponentId from query parameters
//    //console.log('Page Component PUT')
//     if (!id) {
//       return NextResponse.json({ error: 'Missing id' }, { status: 400 });
//     }

//     const data = await req.json();
//     const { order } = data;

//     if (order === undefined) {
//       return NextResponse.json({ error: 'Missing order' }, { status: 400 });
//     }

//     // Update the order of the component using the id
//     const updatedPageComponent = await prisma.pageComponent.update({
//       where: {
//         id: parseInt(id),
//       },
//       data: {
//         order: order,
//       },
//     });

//     return NextResponse.json(updatedPageComponent);
//   } catch (error) {
//     console.error('Error updating page component:', error);
//     return NextResponse.json(
//       { error: 'Failed to update page component', details: error.message },
//       { status: 500 }
//     );
//   }
// }

// DELETE request - Remove the association between page and component
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get('pageId');
  const componentId = searchParams.get('componentId');

  if (!pageId || !componentId || isNaN(parseInt(pageId)) || isNaN(parseInt(componentId))) {
    return new Response(JSON.stringify({ error: 'Invalid pageId or componentId' }), { status: 400 });
  }

  try {
    await prisma.pageComponent.delete({
      where: {
        pageId_componentId: {
          pageId: parseInt(pageId),
          componentId: parseInt(componentId),
        },
      },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error deleting component association:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete component association' }), { status: 500 });
  }
}

