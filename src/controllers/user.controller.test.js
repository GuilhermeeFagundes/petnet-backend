import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import * as userController from './user.controller.js';
import * as userService from '../services/user.service.js';
import { ResponseError } from '../errors/ResponseError.js';
import { generateCpf } from "../utils/test.utils.js";

const TEST_CPF_1 = generateCpf();
const TEST_CPF_2 = generateCpf();

jest.mock('../services/user.service.js');

describe('User Controller (user.controller.js)', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('listUsersController', () => {
    it('deve retornar a lista de usuários com status 200', async () => {
      const mockUsers = [{ cpf: TEST_CPF_1 }, { cpf: '45678901234' }];
      userService.listUsersService.mockResolvedValue(mockUsers);

      await userController.listUsersController(req, res);

      expect(userService.listUsersService).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });
  });

  describe('showUserController', () => {
    it('deve retornar o usuário solicitado pelo CPF', async () => {
      req.params.user_cpf = TEST_CPF_2;
      const mockUser = { cpf: TEST_CPF_2, name: 'João' };
      userService.showUserService.mockResolvedValue(mockUser);

      await userController.showUserController(req, res);

      expect(userService.showUserService).toHaveBeenCalledWith(TEST_CPF_2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('createUserController', () => {
    it('deve criar um usuário e retornar status 201', async () => {
      req.body = { cpf: TEST_CPF_1, email: 't@t.com', name: 'J', password: TEST_CPF_1 };
      const mockUser = { ...req.body, id: 1 };
      userService.createUserService.mockResolvedValue(mockUser);

      await userController.createUserController(req, res);

      expect(userService.createUserService).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('deve lançar erro se faltar campo obrigatório', async () => {
      req.body = { cpf: TEST_CPF_1 }; // Faltam dados

      try {
        await userController.createUserController(req, res);
        throw new Error('Deveria lançar ResponseError');
      } catch (error) {
        expect(error).toBeInstanceOf(ResponseError);
        expect(error.httpCode).toBe(400);
      }
    });
  });

  describe('updateUserController', () => {
    it('deve atualizar o usuário e retornar 200', async () => {
      req.params.user_cpf = TEST_CPF_1;
      req.body = { name: 'Novo Nome' };
      const mockUser = { cpf: TEST_CPF_1, name: 'Novo Nome' };
      userService.updateUserService.mockResolvedValue(mockUser);

      await userController.updateUserController(req, res);

      expect(userService.updateUserService).toHaveBeenCalledWith(TEST_CPF_1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('deve lançar erro de validação se o email fornecido for inválido', async () => {
      req.params.user_cpf = TEST_CPF_1;
      req.body = { email: 'invalid-email' };
      
      try {
        await userController.updateUserController(req, res);
        throw new Error('Deveria lançar ResponseError');
      } catch (error) {
        expect(error).toBeInstanceOf(ResponseError);
        expect(error.httpCode).toBe(400);
      }
    });
  });

  describe('deleteUserController', () => {
    it('deve deletar o usuário e retornar mensagem de sucesso', async () => {
      req.params.user_cpf = TEST_CPF_1;
      userService.deleteUserService.mockResolvedValue();

      await userController.deleteUserController(req, res);

      expect(userService.deleteUserService).toHaveBeenCalledWith(TEST_CPF_1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuário excluído com sucesso' });
    });
  });

  describe('reactivateUserController', () => {
    it('deve reativar o usuário e retornar mensagem de sucesso', async () => {
      req.params.user_cpf = TEST_CPF_1;
      userService.reactivateUserService.mockResolvedValue();

      await userController.reactivateUserController(req, res);

      expect(userService.reactivateUserService).toHaveBeenCalledWith(TEST_CPF_1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuário reativado com sucesso' });
    });
  });
});
