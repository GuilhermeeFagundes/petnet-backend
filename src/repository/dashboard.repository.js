import prisma from '../../prisma/prisma.js';

export const getSchedulesForDashboard = async (startDate, endDate) => {
    return await prisma.schedule.findMany({
        where: {
            date_time: {
                gte: startDate,
                lte: endDate
            }
        },
        include: {
            collaborator: { select: { name: true, cpf: true } },
            services: { select: { name: true } },
            client: { select: { name: true, cpf: true } }
        }
    });
};
