import {
  listSchedulesService, findScheduleByIdService, createScheduleService,
  updateScheduleService, deleteScheduleService, deliverScheduleService, confirmScheduleService
} from "../services/schedule.service.js";
import { translateEnums } from "../utils/enum.utils.js";
import { ScheduleEnums } from "../enums/schedule.enums.js";
import { requireFields, parseId } from "../utils/validators.utils.js";
import { ResponseError } from "../errors/ResponseError.js";
import { renderConfirmationPage } from "../utils/html.utils.js";

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

export const deliverScheduleController = async (req, res) => {
  const id = parseId(req.params.id, 'ID do agendamento');
  const updatedSchedule = await deliverScheduleService(id, req.user);
  return res.status(200).json(translateEnums(updatedSchedule, ScheduleEnums));
};

// Acessado pelo clique direto no link do e-mail de lembrete: precisa responder com uma página
// HTML (e não JSON crú) para a aba aberta pelo cliente ficar transparente para o usuário final.
export const confirmScheduleController = async (req, res) => {
  try {
    const id = parseId(req.params.id, 'ID do agendamento');
    await confirmScheduleService(id);

    return res.status(200).send(renderConfirmationPage({
      title: 'Agendamento confirmado!',
      message: 'Tudo certo! Esperamos você e seu pet no horário marcado. Você já pode fechar esta aba.'
    }));
  } catch (err) {
    const httpCode = err instanceof ResponseError ? err.httpCode : 500;
    const message = err instanceof ResponseError
      ? err.message
      : 'Ocorreu um erro inesperado ao confirmar o agendamento. Tente novamente ou contate a NetCão.';

    return res.status(httpCode).send(renderConfirmationPage({
      title: 'Não foi possível confirmar',
      message,
      isError: true
    }));
  }
};
