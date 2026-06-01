import { listSchedules, findScheduleById, createSchedule, updateSchedule, deleteSchedule } from "../repository/schedule.repository.js";
import { parseDateField } from "../utils/date.utils.js";
import { sanitizeData } from "../utils/sanitize.utils.js";
import { ResponseError } from "../errors/ResponseError.js";
import { validateAndConvertEnums } from "../utils/enum.utils.js";
import { ScheduleEnums } from "../enums/schedule.enums.js";

const ALLOWED_CREATE_FIELDS = ["client_cpf", "pet_id", "collaborator_cpf", "date_time", "duration", "status", "observation", "services"];
const ALLOWED_UPDATE_FIELDS = ["date_time", "duration", "status", "collaborator_cpf", "observation", "services"];
const ALLOWED_QUERY_FIELDS = ["initial_date", "final_date"];

export const listSchedulesService = async (queryData, user) => {
  const sanitized = sanitizeData(ALLOWED_QUERY_FIELDS, queryData) || {};

  const { initial_date, final_date } = sanitized;
  const now = new Date();

  const startOfMonth = initial_date ? new Date(initial_date) : new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = final_date ? new Date(final_date) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const filters = {};

  if (user.type === 'COLLABORATOR') {
    filters.collaborator_cpf = user.cpf;
  } else if (user.type === 'CUSTOMER') {
    filters.client_cpf = user.cpf;
  }

  return await listSchedules(startOfMonth, endOfMonth, filters);
};

export const findScheduleByIdService = async (id, user) => {
  const schedule = await findScheduleById(id);
  if (!schedule) throw new ResponseError("Agendamento não encontrado", 404);

  if (user.type === 'CUSTOMER' && schedule.client_cpf !== user.cpf) {
    throw new ResponseError("Acesso negado a este agendamento", 403);
  }

  if (user.type === 'COLLABORATOR' && schedule.collaborator_cpf !== user.cpf) {
    throw new ResponseError("Acesso negado a este agendamento", 403);
  }

  return schedule;
};

export const createScheduleService = async (scheduleData) => {
  const sanitized = sanitizeData(ALLOWED_CREATE_FIELDS, scheduleData);

  if (!sanitized) {
    throw new ResponseError("Dados de agendamento inválidos ou incompletos", 400);
  }

  const createData = validateAndConvertEnums(sanitized, ScheduleEnums);
  parseDateField(createData, 'date_time');

  return await createSchedule(createData);
};

export const updateScheduleService = async (id, scheduleData) => {
  const sanitized = sanitizeData(ALLOWED_UPDATE_FIELDS, scheduleData);

  if (!sanitized) {
    throw new ResponseError("Nenhum dado válido enviado para atualização", 400);
  }

  const updateData = validateAndConvertEnums(sanitized, ScheduleEnums);

  const scheduleExists = await findScheduleById(id);
  if (!scheduleExists) {
    throw new ResponseError("Agendamento não encontrado", 404);
  }

  parseDateField(updateData, 'date_time');

  return await updateSchedule(id, updateData);
};

export const deleteScheduleService = async (id) => {
  const schedule = await findScheduleById(id);
  if (!schedule) {
    throw new ResponseError("Agendamento não encontrado", 404);
  }

  return await deleteSchedule(id);
};

export const deliverScheduleService = async (id) => {
  const scheduleExists = await findScheduleById(id);
  if (!scheduleExists) {
    throw new ResponseError("Agendamento não encontrado", 404);
  }

  return await updateSchedule(id, { status: ScheduleEnums.find(e => e.key === 'status').values.DELIVERED });
};
