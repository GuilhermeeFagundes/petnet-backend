import prisma from '../../prisma/prisma.js';

//OLHAR TELAS RAPHA

// Listar todos os agendamentos (incluindo Cliente, Pet e Colaborador) com filtro de data
const listSchedules = async (initialDate, finalDate, filters = {}) => {
  return await prisma.schedule.findMany({
    where: {
      date_time: {
        gte: initialDate,
        lte: finalDate
      },
      ...filters
    },
    include: {
      client: {
        select: { name: true }
      },
      pet: {
        include: {
          user: {
            select: { name: true }
          }
        }
      },
      collaborator: {
        select: { name: true }
      },
      services: true
    },
    orderBy: { date_time: 'asc' }
  });
}


// Encontrar agendamento por ID
const findScheduleById = async (id) => {
  return await prisma.schedule.findUnique({
    where: { id: Number(id) },
    include: {
      client: { select: { name: true, cpf: true } },
      pet: true,
      collaborator: { select: { name: true, cpf: true } },
      services: true
    }
  });
}

// Criar Agendamento
const createSchedule = async (scheduleData) => {
  const { services, ...data } = scheduleData;
  return await prisma.schedule.create({
    data: {
      ...data,
      services: services ? { connect: services.map(id => ({ id })) } : undefined,
    },
    include: { services: true }
  });
}

// Atualizar Agendamento
const updateSchedule = async (id, scheduleData) => {
  const { services, ...data } = scheduleData;
  return await prisma.schedule.update({
    where: { id: Number(id) },
    data: {
      ...data,
      services: services ? { set: services.map(id => ({ id })) } : undefined,
    },
    include: { services: true }
  });
};

// Deletar Agendamento
const deleteSchedule = async (id) => {
  return await prisma.schedule.delete({
    where: { id: Number(id) }
  });
}

export default {
  listSchedules,

  findScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
