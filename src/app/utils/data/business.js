import prisma from '../prisma';

export async function getAllBusinesses() {
    try {
      return await prisma.business.findMany({
        orderBy: { businessName: 'desc' },
      });
    } catch (error) {
      console.error('Error getting all businesses:', error);
      throw new Error('Failed to retrieve businesses.');
    }
  }