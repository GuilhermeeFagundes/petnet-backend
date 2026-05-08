import {
  listSchedulesService, findScheduleByIdService, createScheduleService, updateScheduleService, deleteScheduleService
} from "../services/schedule.service.js";
import { translateEnums } from "../utils/enum.utils.js";
import { ScheduleEnums } from "../enums/schedule.enums.js";
import { ResponseError } from "../errors/ResponseError.js";

// Listar todos os agendamentos com filtro de range de data
export const listSchedulesController = async (req, res) => {
  const schedules = await listSchedulesService(req.query, req.user);
  return res.status(200).json(translateEnums(schedules, ScheduleEnums));
};


// Buscar agendamento por ID
export const findScheduleByIdController = async (req, res) => {
  const { id } = req.params;
  const schedule = await findScheduleByIdService(id, req.user);
  return res.status(200).json(translateEnums(schedule, ScheduleEnums));
};

// Criar novo agendamento
export const createScheduleController = async (req, res) => {
  const { client_cpf, pet_id, collaborator_cpf, date_time } = req.body;

  if (!client_cpf || !pet_id || !collaborator_cpf || !date_time) {
    throw new ResponseError("Campos obrigatórios faltando (client_cpf, pet_id, collaborator_cpf, date_time)", 400);
  }

  const newSchedule = await createScheduleService(req.body);
  return res.status(201).json(translateEnums(newSchedule, ScheduleEnums));
};

// Atualizar agendamento
export const updateScheduleController = async (req, res) => {
  const { id } = req.params;
  const scheduleData = req.body;

  const updatedSchedule = await updateScheduleService(id, scheduleData);
  return res.status(200).json(translateEnums(updatedSchedule, ScheduleEnums));
};

// Deletar agendamento
export const deleteScheduleController = async (req, res) => {
  const { id } = req.params;
  await deleteScheduleService(id);
  return res.status(200).json({ message: "Agendamento excluído com sucesso" });
};
