import prisma from '../prisma';

// Get all pages
export async function getAllPages() {
  try {
    return await prisma.page.findMany({
      orderBy: { date: 'desc' },
    });
  } catch (error) {
    console.error('Error getting all pages:', error);
    throw new Error('Failed to retrieve pages.');
  }
}

// Get a single page by slug
export async function getPageBySlug(slug) {
  try {
    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        components: {
          include: {
            component: true, // Fetch the related component data
          },
          orderBy: {
            order: 'asc', // Order the components by the `order` field from the `PageComponent`
          },
        },
      },
    });

    // Ensure components is always an array
    if (!page) throw new Error(`Page not found with slug: ${slug}`);
    page.components = page.components || [];

    return page;
  } catch (error) {
    console.error(`Error getting page with slug "${slug}":`, error);
    throw new Error('Failed to retrieve the page.');
  }
}  

// Create a new page
export async function createPage(data) {
    console.log('Create Page Data:', data);
  try {
    return await prisma.page.create({
      data,
    });
  } catch (error) {
    console.error('Error creating new page:', error);
    throw new Error('Failed to create the page.');
  }
}

// Update an existing page by id
export async function updatePage(id, data) {
  try {
    return await prisma.page.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error(`Error updating page with id "${id}":`, error);
    throw new Error('Failed to update the page.');
  }
}

// Delete a page by id
export async function deletePage(id) {
  try {
    return await prisma.page.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting page with id "${id}":`, error);
    throw new Error('Failed to delete the page.');
  }
}

export async function getComponentsByPageId(pageId) {
  try {
    return await prisma.component.findMany({
      where: { pageId },
      orderBy: { order: 'asc' }, // Optional: order components by their order field
    });
  } catch (error) {
    console.error(`Error getting components for page with ID "${pageId}":`, error);
    throw new Error('Failed to retrieve components for the page.');
  }
}
