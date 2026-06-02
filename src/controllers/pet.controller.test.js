import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import * as petController from './pet.controller.js';
import * as petService from '../services/pet.service.js';
import { ResponseError } from '../errors/ResponseError.js';
import { generateCpf } from "../utils/test.utils.js";

const TEST_CPF_1 = generateCpf();

jest.mock('../services/pet.service.js');
jest.mock('../utils/log.utils.js');

describe('Pet Controller (pet.controller.js)', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, user: { cpf: '777' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('findPetsByUserController', () => {
    it('deve buscar os pets do usuário logado', async () => {
      const mockPets = [{ id: 1, name: 'Rex' }];
      petService.findPetsByUserService.mockResolvedValue(mockPets);

      await petController.findPetsByUserController(req, res);

      expect(petService.findPetsByUserService).toHaveBeenCalledWith('777');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPets);
    });
  });

  describe('listPetsController', () => {
    it('deve listar todos os pets', async () => {
      petService.listPetsService.mockResolvedValue([]);

      await petController.listPetsController(req, res);

      expect(petService.listPetsService).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('findPetByIdController', () => {
    it('deve buscar o pet por ID numérico', async () => {
      req.params.id = '10';
      const mockPet = { id: 10, name: 'Bidu' };
      petService.findPetByIdService.mockResolvedValue(mockPet);

      await petController.findPetByIdController(req, res);

      expect(petService.findPetByIdService).toHaveBeenCalledWith(10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPet);
    });
  });

  describe('createPetController', () => {
    it('deve criar um pet com campos obrigatórios e retornar 201', async () => {
      req.body = { user_cpf: TEST_CPF_1, name: 'Rex', species: 'dog', size: 'M' };
      const mockPet = { id: 1, ...req.body };
      petService.createPetService.mockResolvedValue(mockPet);

      await petController.createPetController(req, res);

      expect(petService.createPetService).toHaveBeenCalledWith(req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockPet);
    });

    it('deve falhar se não enviar campos obrigatórios', async () => {
      req.body = { name: 'Rex' };
      try {
        await petController.createPetController(req, res);
        throw new Error('Deveria lançar ResponseError');
      } catch (error) {
        expect(error).toBeInstanceOf(ResponseError);
      }
    });
  });

  describe('updatePetController', () => {
    it('deve atualizar o pet pelo ID e retornar 200', async () => {
      req.params.id = '5';
      req.body = { name: 'Rex Novo' };
      petService.updatePetService.mockResolvedValue({ id: 5, name: 'Rex Novo' });

      await petController.updatePetController(req, res);

      expect(petService.updatePetService).toHaveBeenCalledWith(5, req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deletePetController', () => {
    it('deve excluir o pet pelo ID e retornar sucesso', async () => {
      req.params.id = '5';
      petService.deletePetService.mockResolvedValue();

      await petController.deletePetController(req, res);

      expect(petService.deletePetService).toHaveBeenCalledWith(5, req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Pet excluído com sucesso' });
    });
  });
});
