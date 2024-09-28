import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getThemeSettings() {
    return await prisma.themeSettings.findUnique({
        where: { id: 1 },
        include: {
          headerMenu: {
            include: {
              menuItems: true, // Include the menu items in the header menu
            },
          },
          footerMenu: {
            include: {
              menuItems: true, // Include the menu items in the footer menu
            },
          },
        },
      });
}

export async function getActiveNotifications(currentUrl) {
  const activeNotifications = await prisma.notification.findMany({
    where: {
      startTime: {
        lte: new Date(),
      },
      endTime: {
        gte: new Date(),
      },
      OR: [
        {
          url: currentUrl, // Show notifications specific to the current URL
        },
        {
          url: '', // Show notifications that should appear on all pages
        },
        {
          url: null, // Handle notifications where the url is null
        },
      ],
    },
  });

  return activeNotifications;
}


export default prisma;