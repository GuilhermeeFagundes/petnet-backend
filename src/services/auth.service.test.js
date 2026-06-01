import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { registerService, loginService } from './auth.service.js';
import * as userRepository from '../repository/user.repository.js';
import * as authRepository from '../repository/auth.repository.js';
import * as jwtUtils from '../utils/jwt.utils.js';
import { ResponseError } from '../errors/ResponseError.js';
import bcrypt from 'bcrypt';
import { generateCpf } from "../utils/test.utils.js";

const TEST_CPF_1 = generateCpf();

jest.mock('../repository/user.repository.js');
jest.mock('../repository/auth.repository.js');
jest.mock('../utils/jwt.utils.js');
jest.mock('bcrypt');

describe('Auth Service (auth.service.js)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerService', () => {
    it('deve registrar um novo usuário e retornar token', async () => {
      const userData = { cpf: TEST_CPF_1, email: 't@t.com', name: 'J', password: 'Password1', type: 'CUSTOMER' };
      userRepository.findUserByCpf.mockResolvedValue(null);
      userRepository.findUserByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed');
      userRepository.createUser.mockResolvedValue({ ...userData, password: 'hashed' });
      jwtUtils.generateToken.mockReturnValue('token_xyz');

      const result = await registerService(userData);

      expect(userRepository.createUser).toHaveBeenCalled();
      expect(result.token).toBe('token_xyz');
      expect(result.user.email).toBe('t@t.com');
    });

    it('deve lançar erro se o CPF já estiver cadastrado', async () => {
      userRepository.findUserByCpf.mockResolvedValue({ cpf: TEST_CPF_1 });
      const userData = { cpf: TEST_CPF_1, password: 'Password1' };
      await expect(registerService(userData)).rejects.toThrow('CPF já cadastrado no sistema.');
    });

    it('deve lançar erro se o e-mail já estiver cadastrado', async () => {
      userRepository.findUserByCpf.mockResolvedValue(null);
      userRepository.findUserByEmail.mockResolvedValue({ email: 't@t.com' });
      const userData = { cpf: TEST_CPF_1, email: 't@t.com', password: 'Password1' };
      await expect(registerService(userData)).rejects.toThrow('E-mail já cadastrado no sistema.');
    });

    it('deve lançar erro se os dados forem inválidos para registro', async () => {
      await expect(registerService({})).rejects.toThrow('Dados inválidos para cadastro.');
    });
  });

  describe('loginService', () => {
    it('deve autenticar o usuário e retornar o token se as credenciais forem válidas', async () => {
      const mockUser = { cpf: TEST_CPF_1, email: 't@t.com', password: 'hashed_password', name: 'J', type: 'CUSTOMER' };
      authRepository.findUserByEmailForAuth.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwtUtils.generateToken.mockReturnValue('token_login');

      const result = await loginService('t@t.com', TEST_CPF_1);

      expect(result.token).toBe('token_login');
      expect(result.user.cpf).toBe(TEST_CPF_1);
    });

    it('deve lançar erro 401 para credenciais inválidas (usuário não encontrado)', async () => {
      authRepository.findUserByEmailForAuth.mockResolvedValue(null);
      await expect(loginService('x@x.com', TEST_CPF_1)).rejects.toThrow('Credenciais inválidas.');
    });

    it('deve lançar erro 401 para credenciais inválidas (senha errada)', async () => {
      authRepository.findUserByEmailForAuth.mockResolvedValue({ password: 'hashed' });
      bcrypt.compare.mockResolvedValue(false);
      await expect(loginService('x@x.com', TEST_CPF_1)).rejects.toThrow('Credenciais inválidas.');
    });
  });
});
