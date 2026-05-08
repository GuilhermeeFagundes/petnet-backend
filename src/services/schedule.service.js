import scheduleRepository from "../repository/schedule.repository.js";
import { sanitizeData } from "../middlewares/utils.middleware.js";
import { ResponseError } from "../errors/ResponseError.js";
import { validateAndConvertEnums } from "../utils/enum.utils.js";
import { ScheduleEnums } from "../enums/schedule.enums.js";

export const listSchedulesService = async (queryData, user) => {
  const allowedFields = ["initial_date", "final_date"];
  const sanitized = sanitizeData(allowedFields, queryData) || {};

  const { initial_date, final_date } = sanitized;
  const now = new Date();

  const startOfMonth = initial_date ? new Date(initial_date) : new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = final_date ? new Date(final_date) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const filters = {};
  
  if (user.type === 'Colaborador') {
    filters.collaborator_cpf = user.cpf;
  } else if (user.type === 'Cliente') {
    filters.client_cpf = user.cpf;
  }

  return await scheduleRepository.listSchedules(startOfMonth, endOfMonth, filters);
}

export const findScheduleByIdService = async (id, user) => {
  const schedule = await scheduleRepository.findScheduleById(id);
  if (!schedule) throw new ResponseError("Agendamento não encontrado", 404);

  // Se for cliente, validar se o agendamento pertence a ele
  if (user.type === 'Cliente' && schedule.client_cpf !== user.cpf) {
    throw new ResponseError("Acesso negado a este agendamento", 403);
  }

  // Se for colaborador, validar se o agendamento é dele
  if (user.type === 'Colaborador' && schedule.collaborator_cpf !== user.cpf) {
    throw new ResponseError("Acesso negado a este agendamento", 403);
  }

  return schedule;
}

export const createScheduleService = async (scheduleData) => {
  const allowedFields = ["client_cpf", "pet_id", "collaborator_cpf", "date_time", "duration", "status", "observation", "services"];
  const sanitized = sanitizeData(allowedFields, scheduleData);

  if (!sanitized) {
    throw new ResponseError("Dados de agendamento inválidos ou incompletos", 400);
  }

  const createData = validateAndConvertEnums(sanitized, ScheduleEnums);

  // Converter date_time para objeto Date se for string
  if (typeof createData.date_time === 'string') {
    createData.date_time = new Date(createData.date_time);
  }

  return await scheduleRepository.createSchedule(createData);
}

export const updateScheduleService = async (id, scheduleData) => {
  const allowedFields = ["date_time", "duration", "status", "collaborator_cpf", "observation", "services"];
  const sanitized = sanitizeData(allowedFields, scheduleData);

  if (!sanitized) {
    throw new ResponseError("Nenhum dado válido enviado para atualização", 400);
  }

  const updateData = validateAndConvertEnums(sanitized, ScheduleEnums);

  const scheduleExists = await scheduleRepository.findScheduleById(id);
  if (!scheduleExists) {
    throw new ResponseError("Agendamento não encontrado", 404);
  }

  if (updateData.date_time && typeof updateData.date_time === 'string') {
    updateData.date_time = new Date(updateData.date_time);
  }

  return await scheduleRepository.updateSchedule(id, updateData);
}

export const deleteScheduleService = async (id) => {
  const schedule = await scheduleRepository.findScheduleById(id);
  if (!schedule) {
    throw new ResponseError("Agendamento não encontrado", 404);
  }

  return await scheduleRepository.deleteSchedule(id);
}
