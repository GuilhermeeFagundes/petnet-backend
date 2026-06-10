import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import {
  listSchedulesController,
  findScheduleByIdController,
  createScheduleController,
  updateScheduleController,
  deleteScheduleController,
  deliverScheduleController
} from './schedule.controller.js';
import * as scheduleService from '../services/schedule.service.js';
import { ResponseError } from '../errors/ResponseError.js';
import { generateCpf } from "../utils/test.utils.js";

const TEST_CPF_1 = generateCpf();
const TEST_CPF_2 = generateCpf();

jest.mock('../services/schedule.service.js');
jest.mock('../utils/log.utils.js');

describe('Schedule Controller (schedule.controller.js)', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {}, user: { cpf: TEST_CPF_2, type: 'CUSTOMER' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('listSchedulesController', () => {
    it('deve listar agendamentos e retornar status 200', async () => {
      const mockSchedules = [{ id: 1, date_time: new Date() }];
      scheduleService.listSchedulesService.mockResolvedValue(mockSchedules);

      await listSchedulesController(req, res);

      expect(scheduleService.listSchedulesService).toHaveBeenCalledWith(req.query, req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('findScheduleByIdController', () => {
    it('deve buscar um agendamento por ID e retornar status 200', async () => {
      req.params.id = '1';
      const mockSchedule = { id: 1, date_time: new Date() };
      scheduleService.findScheduleByIdService.mockResolvedValue(mockSchedule);

      await findScheduleByIdController(req, res);

      expect(scheduleService.findScheduleByIdService).toHaveBeenCalledWith(1, req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it('deve lançar ResponseError se o ID for inválido', async () => {
      req.params.id = 'abc';
      await expect(findScheduleByIdController(req, res)).rejects.toThrow(ResponseError);
    });
  });

  describe('createScheduleController', () => {
    it('deve criar um agendamento e retornar status 201', async () => {
      req.body = { client_cpf: TEST_CPF_1, pet_id: 1, collaborator_cpf: '45678901234', date_time: '2023-10-10' };
      const mockNewSchedule = { id: 1, ...req.body };
      scheduleService.createScheduleService.mockResolvedValue(mockNewSchedule);

      await createScheduleController(req, res);

      expect(scheduleService.createScheduleService).toHaveBeenCalledWith(req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('deve lançar ResponseError se campos obrigatórios estiverem faltando', async () => {
      req.body = { client_cpf: TEST_CPF_1 };
      await expect(createScheduleController(req, res)).rejects.toThrow(ResponseError);
    });
  });

  describe('updateScheduleController', () => {
    it('deve atualizar um agendamento e retornar status 200', async () => {
      req.params.id = '1';
      req.body = { status: 'CONFIRMED' };
      const mockUpdatedSchedule = { id: 1, status: 'CONFIRMED' };
      scheduleService.updateScheduleService.mockResolvedValue(mockUpdatedSchedule);

      await updateScheduleController(req, res);

      expect(scheduleService.updateScheduleService).toHaveBeenCalledWith(1, req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('deleteScheduleController', () => {
    it('deve excluir um agendamento e retornar status 200', async () => {
      req.params.id = '1';
      scheduleService.deleteScheduleService.mockResolvedValue();

      await deleteScheduleController(req, res);

      expect(scheduleService.deleteScheduleService).toHaveBeenCalledWith(1, req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Agendamento excluído com sucesso" });
    });
  });

  describe('deliverScheduleController', () => {
    it('deve marcar o agendamento como entregue e retornar status 200', async () => {
      req.params.id = '1';
      const mockDeliveredSchedule = { id: 1, status: 'DELIVERED' };
      scheduleService.deliverScheduleService.mockResolvedValue(mockDeliveredSchedule);

      await deliverScheduleController(req, res);

      expect(scheduleService.deliverScheduleService).toHaveBeenCalledWith(1, req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });
  });
});

