import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import {
  listSchedulesService,
  findScheduleByIdService,
  createScheduleService,
  updateScheduleService,
  deleteScheduleService
} from './schedule.service.js';
import * as scheduleRepository from '../repository/schedule.repository.js';
import { ResponseError } from '../errors/ResponseError.js';

jest.mock('../repository/schedule.repository.js');
jest.mock('../utils/log.utils.js');

describe('Schedule Service (schedule.service.js)', () => {
  let mockUser;
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = { cpf: '12345678901', type: 'MANAGER' };
  });

  describe('listSchedulesService', () => {
    it('deve listar agendamentos com filtros de data e permissão de usuário', async () => {
      const mockSchedules = [{ id: 1, client_cpf: '12345678901' }];
      scheduleRepository.listSchedules.mockResolvedValue(mockSchedules);

      const query = { initial_date: '2023-01-01', final_date: '2023-01-31' };
      const user = { type: 'CUSTOMER', cpf: '12345678901' };

      const result = await listSchedulesService(query, user);

      expect(scheduleRepository.listSchedules).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it('deve listar agendamentos filtrando pelo CPF do colaborador', async () => {
      const user = { type: 'COLLABORATOR', cpf: '45678901234' };
      await listSchedulesService({}, user);
      expect(scheduleRepository.listSchedules).toHaveBeenCalledWith(
        expect.any(Date),
        expect.any(Date),
        { collaborator_cpf: '45678901234' }
      );
    });

    it('deve listar agendamentos filtrando pelo CPF do cliente', async () => {
      const user = { type: 'CUSTOMER', cpf: '12345678901' };
      await listSchedulesService({}, user);
      expect(scheduleRepository.listSchedules).toHaveBeenCalledWith(
        expect.any(Date),
        expect.any(Date),
        { client_cpf: '12345678901' }
      );
    });

    it('deve usar datas padrão se nenhuma for fornecida', async () => {
      const user = { type: 'MANAGER', cpf: '000' };
      await listSchedulesService({}, user);
      expect(scheduleRepository.listSchedules).toHaveBeenCalledWith(
        expect.any(Date), // start of month
        expect.any(Date), // end of month
        {} // no filters for MANAGER
      );
    });

    it('deve lidar com dados de query inválidos retornando objeto vazio', async () => {
      const user = { type: 'MANAGER', cpf: '000' };
      await listSchedulesService({ invalid: 'field' }, user);
      expect(scheduleRepository.listSchedules).toHaveBeenCalled();
    });
  });

  describe('findScheduleByIdService', () => {
    it('deve retornar o agendamento se o usuário tiver permissão', async () => {
      const mockSchedule = { id: 1, client_cpf: '12345678901' };
      scheduleRepository.findScheduleById.mockResolvedValue(mockSchedule);

      const user = { type: 'CUSTOMER', cpf: '12345678901' };
      const result = await findScheduleByIdService(1, user);

      expect(result.id).toBe(1);
    });

    it('deve lançar erro 403 se o cliente tentar acessar agendamento de outro', async () => {
      const mockSchedule = { id: 1, client_cpf: '45678901234' };
      scheduleRepository.findScheduleById.mockResolvedValue(mockSchedule);

      const user = { type: 'CUSTOMER', cpf: '12345678901' };
      await expect(findScheduleByIdService(1, user)).rejects.toThrow(ResponseError);
    });

    it('deve lançar erro 403 se o colaborador tentar acessar agendamento de outro colaborador', async () => {
      const mockSchedule = { id: 1, collaborator_cpf: '99988877766' };
      scheduleRepository.findScheduleById.mockResolvedValue(mockSchedule);

      const user = { type: 'COLLABORATOR', cpf: '45678901234' };
      await expect(findScheduleByIdService(1, user)).rejects.toThrow("Acesso negado a este agendamento");
    });

    it('deve permitir que o colaborador acesse seu próprio agendamento', async () => {
      const mockSchedule = { id: 1, collaborator_cpf: '45678901234' };
      scheduleRepository.findScheduleById.mockResolvedValue(mockSchedule);

      const user = { type: 'COLLABORATOR', cpf: '45678901234' };
      const result = await findScheduleByIdService(1, user);
      expect(result.id).toBe(1);
    });

    it('deve lançar erro 404 se o agendamento não for encontrado', async () => {
      scheduleRepository.findScheduleById.mockResolvedValue(null);
      await expect(findScheduleByIdService(1, { type: 'MANAGER' })).rejects.toThrow("Agendamento não encontrado");
    });
  });

  describe('createScheduleService', () => {
    it('deve criar um agendamento com sucesso', async () => {
      const data = { client_cpf: '12345678901', pet_id: 1, collaborator_cpf: '45678901234', date_time: '2023-10-10' };
      scheduleRepository.createSchedule.mockResolvedValue({ id: 1, ...data });

      const result = await createScheduleService(data, mockUser);

      expect(scheduleRepository.createSchedule).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });

    it('deve lançar erro se os dados forem inválidos', async () => {
      await expect(createScheduleService({})).rejects.toThrow("Dados de agendamento inválidos ou incompletos");
    });
  });

  describe('updateScheduleService', () => {
    it('deve atualizar o agendamento se ele existir', async () => {
      scheduleRepository.findScheduleById.mockResolvedValue({ id: 1 });
      scheduleRepository.updateSchedule.mockResolvedValue({ id: 1, status: 'FINISHED' });

     const result = await updateScheduleService(1, { status: 'FINISHED' }, mockUser);

      expect(scheduleRepository.updateSchedule).toHaveBeenCalled();
      expect(result.status).toBe('FINISHED');
    });

    it('deve lançar erro se o agendamento não existir ao atualizar', async () => {
      scheduleRepository.findScheduleById.mockResolvedValue(null);
      await expect(updateScheduleService(1, { status: 'FINISHED' }, mockUser)).rejects.toThrow("Agendamento não encontrado");
    });

    it('deve lançar erro se não houver dados válidos para atualizar', async () => {
      await expect(updateScheduleService(1, { invalid: 'data' })).rejects.toThrow("Nenhum dado válido enviado para atualização");
    });
  });

  describe('deleteScheduleService', () => {
    it('deve excluir o agendamento se ele existir', async () => {
      scheduleRepository.findScheduleById.mockResolvedValue({ id: 1 });
      await deleteScheduleService(1, mockUser);
      expect(scheduleRepository.deleteSchedule).toHaveBeenCalledWith(1);
    });

    it('deve lançar erro se o agendamento não existir ao excluir', async () => {
      scheduleRepository.findScheduleById.mockResolvedValue(null);
      await expect(deleteScheduleService(1, mockUser)).rejects.toThrow("Agendamento não encontrado");
    });
  });
});
