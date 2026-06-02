import prisma from '../../prisma/prisma.js';

export const findUnreadNotificationsByCpf = async (userCPF) => {
    return await prisma.notification.findMany({
        where: { 
            user_cpf: userCPF,
            viewed: false
        },
        orderBy: {
            created_at: 'desc'
        }
    });
};

export const createNotification = async (notificationData) => {
    return await prisma.notification.create({
        data: notificationData
    });
};

export const findNotificationById = async (id) => {
    return await prisma.notification.findUnique({
        where: { id: parseInt(id, 10) }
    });
};

export const updateNotificationViewed = async (id, viewed) => {
    return await prisma.notification.update({
        where: { id: parseInt(id, 10) },
        data: { viewed }
    });
};
