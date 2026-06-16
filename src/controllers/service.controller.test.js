import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import {
  listServicesController,
  findServiceByIdController,
  createServiceController,
  updateServiceController,
  deleteServiceController,
  reactivateServiceController,
  clearServicePictureController
} from './service.controller.js';
import * as serviceService from '../services/service.service.js';
import { ResponseError } from '../errors/ResponseError.js';

jest.mock('../services/service.service.js');

describe('Service Controller (service.controller.js)', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('listServicesController', () => {
    it('deve listar serviços e retornar status 200', async () => {
      const mockServices = [{ id: 1, name: 'Banho' }];
      serviceService.listServicesService.mockResolvedValue(mockServices);

      await listServicesController(req, res);

      expect(serviceService.listServicesService).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockServices);
    });
  });

  describe('findServiceByIdController', () => {
    it('deve buscar um serviço por ID e retornar status 200', async () => {
      req.params.id = '1';
      const mockService = { id: 1, name: 'Banho' };
      serviceService.findServiceByIdService.mockResolvedValue(mockService);

      await findServiceByIdController(req, res);

      expect(serviceService.findServiceByIdService).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockService);
    });
  });

  describe('createServiceController', () => {
    it('deve criar um serviço e retornar status 201', async () => {
      req.body = { name: 'Tosa', description: 'Corte de pelo' };
      const mockNewService = { id: 2, ...req.body };
      serviceService.createServiceService.mockResolvedValue(mockNewService);

      await createServiceController(req, res);

      expect(serviceService.createServiceService).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockNewService);
    });

    it('deve lançar ResponseError se campos obrigatórios estiverem faltando', async () => {
      req.body = { name: 'Tosa' };
      await expect(createServiceController(req, res)).rejects.toThrow(ResponseError);
    });
  });

  describe('updateServiceController', () => {
    it('deve atualizar um serviço e retornar status 200', async () => {
      req.params.id = '1';
      req.body = { description: 'Nova descrição' };
      const mockUpdatedService = { id: 1, name: 'Banho', description: 'Nova descrição' };
      serviceService.updateServiceService.mockResolvedValue(mockUpdatedService);

      await updateServiceController(req, res);

      expect(serviceService.updateServiceService).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedService);
    });
  });

  describe('deleteServiceController', () => {
    it('deve excluir um serviço e retornar status 200', async () => {
      req.params.id = '1';
      serviceService.deleteServiceService.mockResolvedValue();

      await deleteServiceController(req, res);

      expect(serviceService.deleteServiceService).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Serviço excluído com sucesso" });
    });
  });

  describe('reactivateServiceController', () => {
    it('deve reativar um serviço e retornar status 200', async () => {
      req.params.id = '1';
      serviceService.reactivateServiceService.mockResolvedValue();

      await reactivateServiceController(req, res);

      expect(serviceService.reactivateServiceService).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Serviço reativado com sucesso" });
    });
  });

  describe('clearServicePictureController', () => {
    it('deve limpar a foto do serviço e retornar status 200', async () => {
      req.params.id = '1';
      serviceService.clearServicePictureService.mockResolvedValue();

      await clearServicePictureController(req, res);

      expect(serviceService.clearServicePictureService).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Foto do serviço removida com sucesso' });
    });
  });
});
