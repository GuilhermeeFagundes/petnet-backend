import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import {
  listUsersService,
  showUserService,
  createUserService,
  updateUserService,
  deleteUserService,
  reactivateUserService
} from './user.service.js';
import * as userRepository from '../repository/user.repository.js';
import { ResponseError } from '../errors/ResponseError.js';
import bcrypt from 'bcrypt';
import { generateCpf } from "../utils/test.utils.js";

const TEST_CPF_1 = generateCpf();
const TEST_CPF_2 = generateCpf();

jest.mock('../repository/user.repository.js');
jest.mock('bcrypt');
jest.mock('../utils/log.utils.js');

describe('User Service (user.service.js)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listUsersService', () => {
    it('deve listar usuários e mapear campos de imagem e enums', async () => {
      const mockUsers = [{ cpf: TEST_CPF_1, picture_blob: null, type: 'CUSTOMER' }];
      userRepository.listUsers.mockResolvedValue(mockUsers);

      const result = await listUsersService();

      expect(userRepository.listUsers).toHaveBeenCalled();
      expect(result[0].cpf).toBe(TEST_CPF_1);
    });
  });

  describe('showUserService', () => {
    it('deve retornar o usuário se o CPF for válido e o usuário existir', async () => {
      const mockUser = { cpf: TEST_CPF_2, name: 'João', type: 'CUSTOMER' };
      userRepository.findUserByCpf.mockResolvedValue(mockUser);

      const result = await showUserService(TEST_CPF_2);

      expect(userRepository.findUserByCpf).toHaveBeenCalledWith(TEST_CPF_2);
      expect(result.cpf).toBe(TEST_CPF_2);
    });

    it('deve lançar erro se o usuário não for encontrado', async () => {
      userRepository.findUserByCpf.mockResolvedValue(null);
      await expect(showUserService(TEST_CPF_2)).rejects.toThrow(ResponseError);
    });
  });

  describe('createUserService', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      const userData = { cpf: TEST_CPF_1, email: 't@t.com', name: 'J', password: 'password', type: 'CUSTOMER' };
      userRepository.findUserByCpf.mockResolvedValue(null);
      userRepository.findUserByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_password');
      userRepository.createUser.mockResolvedValue({ ...userData, password: 'hashed_password' });

      const result = await createUserService({ ...userData });

      expect(userRepository.createUser).toHaveBeenCalled();
      expect(result.email).toBe('t@t.com');
    });
    it('deve lançar erro se o CPF já estiver cadastrado', async () => {
      userRepository.findUserByCpf.mockResolvedValue({ cpf: TEST_CPF_1 });
      await expect(createUserService({ cpf: TEST_CPF_1 })).rejects.toThrow('CPF já cadastrado no sistema.');
    });

    it('deve lançar erro se o e-mail já estiver cadastrado', async () => {
      userRepository.findUserByCpf.mockResolvedValue(null);
      userRepository.findUserByEmail.mockResolvedValue({ email: 't@t.com' });
      await expect(createUserService({ cpf: TEST_CPF_1, email: 't@t.com' })).rejects.toThrow('E-mail já cadastrado no sistema.');
    });
  });

  describe('updateUserService', () => {
    it('deve atualizar o usuário com sucesso', async () => {
      const existingUser = { cpf: TEST_CPF_1, email: 'o@o.com' };
      userRepository.findUserByCpf.mockResolvedValue(existingUser);
      userRepository.updateUser.mockResolvedValue({ ...existingUser, name: 'Novo' });

      const result = await updateUserService(TEST_CPF_1, { name: 'Novo' });

      expect(userRepository.updateUser).toHaveBeenCalled();
      expect(result.name).toBe('Novo');
    });
    it('deve lançar erro se tentar atualizar para um email que já existe', async () => {
      userRepository.findUserByCpf.mockResolvedValue({ cpf: TEST_CPF_1, email: 'o@o.com' });
      userRepository.findUserByEmail.mockResolvedValue({ email: 'new@o.com' });
      await expect(updateUserService(TEST_CPF_1, { email: 'new@o.com' })).rejects.toThrow('Este novo e-mail já está em uso.');
    });

    it('deve atualizar o email com sucesso se o novo email estiver disponível', async () => {
      userRepository.findUserByCpf.mockResolvedValue({ cpf: TEST_CPF_1, email: 'o@o.com' });
      userRepository.findUserByEmail.mockResolvedValue(null);
      userRepository.updateUser.mockResolvedValue({ cpf: TEST_CPF_1, email: 'available@o.com' });
      
      const result = await updateUserService(TEST_CPF_1, { email: 'available@o.com' });
      expect(result.email).toBe('available@o.com');
    });

    it('deve lançar erro se o usuário não for encontrado para atualização', async () => {
      userRepository.findUserByCpf.mockResolvedValue(null);
      await expect(updateUserService(TEST_CPF_1, { name: 'N' })).rejects.toThrow('Usuário não cadastrado no sistema.');
    });

    it('deve lançar erro se os dados forem inválidos para atualização', async () => {
      await expect(updateUserService(TEST_CPF_1, {})).rejects.toThrow('Estrutura de dados inválida para atualização.');
    });

    it('deve lançar erro se tentar atualizar usuário inativo', async () => {
      userRepository.findUserByCpf.mockResolvedValue({ cpf: TEST_CPF_1, excluded_at: new Date() });
      await expect(updateUserService(TEST_CPF_1, { name: 'Novo' })).rejects.toThrow('Usuário inativo. Reative-o antes de atualizar.');
    });

    it('deve criptografar a nova senha se fornecida na atualização', async () => {
      const existingUser = { cpf: TEST_CPF_1, email: 'o@o.com' };
      userRepository.findUserByCpf.mockResolvedValue(existingUser);
      userRepository.updateUser.mockResolvedValue({ ...existingUser, password: 'new_hashed' });
      bcrypt.hash.mockResolvedValue('new_hashed');

      const result = await updateUserService(TEST_CPF_1, { password: 'NewPassword123' });

      expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword123', 10);
      expect(result.status).toBeUndefined(); // translateEnums might not have translations here
    });
  });

  describe('deleteUserService', () => {
    it('deve excluir o usuário se ele existir', async () => {
      userRepository.findUserByCpf.mockResolvedValue({ cpf: TEST_CPF_1 });
      await deleteUserService(TEST_CPF_1);
      expect(userRepository.deleteUser).toHaveBeenCalledWith(TEST_CPF_1);
    });

    it('deve lançar erro se o usuário não for encontrado para exclusão', async () => {
      userRepository.findUserByCpf.mockResolvedValue(null);
      await expect(deleteUserService(TEST_CPF_1)).rejects.toThrow('Usuário não cadastrado no sistema.');
    });
  });

  describe('reactivateUserService', () => {
    it('deve reativar o usuário se ele existir', async () => {
      userRepository.findUserByCpf.mockResolvedValue({ cpf: TEST_CPF_1 });
      await reactivateUserService(TEST_CPF_1);
      expect(userRepository.reactivateUser).toHaveBeenCalledWith(TEST_CPF_1);
    });

    it('deve lançar erro se o usuário não for encontrado para reativação', async () => {
      userRepository.findUserByCpf.mockResolvedValue(null);
      await expect(reactivateUserService(TEST_CPF_1)).rejects.toThrow('Usuário não cadastrado no sistema.');
    });
  });
});
