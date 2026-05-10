import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import {
  listServicesService,
  findServiceByIdService,
  createServiceService,
  updateServiceService,
  deleteServiceService,
  reactivateServiceService
} from './service.service.js';
import * as serviceRepository from '../repository/service.repository.js';
import { ResponseError } from '../errors/ResponseError.js';

jest.mock('../repository/service.repository.js');

describe('Service Service (service.service.js)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listServicesService', () => {
    it('deve listar todos os serviços', async () => {
      const mockServices = [{ id: 1, name: 'Banho' }];
      serviceRepository.listServices.mockResolvedValue(mockServices);

      const result = await listServicesService();

      expect(serviceRepository.listServices).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('findServiceByIdService', () => {
    it('deve retornar o serviço se ele existir', async () => {
      const mockService = { id: 1, name: 'Banho' };
      serviceRepository.findServiceById.mockResolvedValue(mockService);

      const result = await findServiceByIdService(1);

      expect(serviceRepository.findServiceById).toHaveBeenCalledWith(1);
      expect(result.name).toBe('Banho');
    });

    it('deve lançar erro 404 se o serviço não existir', async () => {
      serviceRepository.findServiceById.mockResolvedValue(null);
      await expect(findServiceByIdService(1)).rejects.toThrow(ResponseError);
    });
  });

  describe('createServiceService', () => {
    it('deve criar um serviço com sucesso', async () => {
      const serviceData = { name: 'Tosa', description: 'Corte' };
      serviceRepository.createService.mockResolvedValue({ id: 1, ...serviceData });

      const result = await createServiceService(serviceData);

      expect(serviceRepository.createService).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });

    it('deve lançar erro se os dados forem inválidos', async () => {
      await expect(createServiceService({})).rejects.toThrow("Dados inválidos para criação do serviço");
    });
  });

  describe('updateServiceService', () => {
    it('deve atualizar o serviço com sucesso', async () => {
      serviceRepository.findServiceById.mockResolvedValue({ id: 1 });
      serviceRepository.updateService.mockResolvedValue({ id: 1, name: 'Novo' });

      const result = await updateServiceService(1, { name: 'Novo' });

      expect(serviceRepository.updateService).toHaveBeenCalled();
      expect(result.name).toBe('Novo');
    });

    it('deve lançar erro se o serviço não existir ao atualizar', async () => {
      serviceRepository.findServiceById.mockResolvedValue(null);
      await expect(updateServiceService(1, { name: 'Novo' })).rejects.toThrow("Serviço não encontrado");
    });

    it('deve lançar erro se não houver campos válidos para atualizar', async () => {
      await expect(updateServiceService(1, { invalid: 'data' })).rejects.toThrow("Nenhum campo válido enviado para atualização");
    });
  });

  describe('deleteServiceService', () => {
    it('deve excluir o serviço', async () => {
      await deleteServiceService(1);
      expect(serviceRepository.deleteService).toHaveBeenCalledWith(1);
    });
  });

  describe('reactivateServiceService', () => {
    it('deve reativar o serviço', async () => {
      await reactivateServiceService(1);
      expect(serviceRepository.reactivateService).toHaveBeenCalledWith(1);
    });
  });
});
