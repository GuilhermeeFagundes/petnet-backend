import {
  listSchedulesService, findScheduleByIdService, createScheduleService,
  updateScheduleService, deleteScheduleService
} from "../services/schedule.service.js";
import { translateEnums } from "../utils/enum.utils.js";
import { ScheduleEnums } from "../enums/schedule.enums.js";
import { requireFields, parseId } from "../utils/validators.utils.js";

export const listSchedulesController = async (req, res) => {
  const schedules = await listSchedulesService(req.query, req.user);
  return res.status(200).json(translateEnums(schedules, ScheduleEnums));
};

export const findScheduleByIdController = async (req, res) => {
  const id = parseId(req.params.id, 'ID do agendamento');
  const schedule = await findScheduleByIdService(id, req.user);
  return res.status(200).json(translateEnums(schedule, ScheduleEnums));
};

export const createScheduleController = async (req, res) => {
  requireFields(req.body, ['client_cpf', 'pet_id', 'collaborator_cpf', 'date_time']);

  const newSchedule = await createScheduleService(req.body, req.user);
  return res.status(201).json(translateEnums(newSchedule, ScheduleEnums));
};

export const updateScheduleController = async (req, res) => {
  const id = parseId(req.params.id, 'ID do agendamento');
  const updatedSchedule = await updateScheduleService(id, req.body, req.user);
  return res.status(200).json(translateEnums(updatedSchedule, ScheduleEnums));
};

export const deleteScheduleController = async (req, res) => {
  const id = parseId(req.params.id, 'ID do agendamento');
  await deleteScheduleService(id, req.user);
  return res.status(200).json({ message: "Agendamento excluído com sucesso" });
};
