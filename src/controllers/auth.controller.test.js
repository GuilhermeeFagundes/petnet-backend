import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { registerController, loginController, logoutController } from './auth.controller.js';
import * as authService from '../services/auth.service.js';
import * as cookieUtils from '../utils/cookie.utils.js';
import { ResponseError } from '../errors/ResponseError.js';
import { generateCpf } from "../utils/test.utils.js";

const TEST_CPF_1 = generateCpf();
const TEST_CPF_2 = generateCpf();

// Mock dos services e dependências
jest.mock('../services/auth.service.js');

describe('Auth Controller (auth.controller.js)', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('registerController', () => {
    it('deve realizar o registro, configurar o cookie e retornar status 201 com dados do usuário', async () => {
      req.body = { cpf: TEST_CPF_2, email: 'teste@teste.com', name: 'João', password: 'SenhaForte1' };
      const mockUser = { name: 'João', cpf: TEST_CPF_2 };
      const mockToken = 'meu_token_jwt';
      
      authService.registerService.mockResolvedValue({ token: mockToken, user: mockUser });

      await registerController(req, res);

      expect(authService.registerService).toHaveBeenCalledWith(req.body);
      expect(res.cookie).toHaveBeenCalledWith('token', mockToken, cookieUtils.cookieOptions);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it('deve lançar ResponseError 400 se faltarem campos obrigatórios no registro', async () => {
      req.body = { name: 'Falta campos' }; // faltam cpf, email, password

      try {
        await registerController(req, res);
        throw new Error('Deveria lançar erro');
      } catch (error) {
        expect(error).toBeInstanceOf(ResponseError);
        expect(error.httpCode).toBe(400);
      }
    });
  });

  describe('loginController', () => {
    it('deve realizar login, configurar cookie e retornar status 200', async () => {
      req.body = { email: 'teste@teste.com', password: TEST_CPF_1 };
      const mockUser = { name: 'João' };
      const mockToken = 'token123';

      authService.loginService.mockResolvedValue({ token: mockToken, user: mockUser });

      await loginController(req, res);

      expect(authService.loginService).toHaveBeenCalledWith('teste@teste.com', TEST_CPF_1);
      expect(res.cookie).toHaveBeenCalledWith('token', mockToken, cookieUtils.cookieOptions);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Login realizado com sucesso.', user: mockUser });
    });
  });

  describe('logoutController', () => {
    it('deve limpar o cookie de token e retornar 200', () => {
      logoutController(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('token', { httpOnly: true, sameSite: 'strict' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logout realizado com sucesso.' });
    });
  });
});
