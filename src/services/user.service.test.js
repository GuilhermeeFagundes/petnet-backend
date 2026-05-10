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

jest.mock('../repository/user.repository.js');
jest.mock('bcrypt');

describe('User Service (user.service.js)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listUsersService', () => {
    it('deve listar usuários e mapear campos de imagem e enums', async () => {
      const mockUsers = [{ cpf: '12345678901', picture_blob: null, type: 'Cliente' }];
      userRepository.listUsers.mockResolvedValue(mockUsers);

      const result = await listUsersService();

      expect(userRepository.listUsers).toHaveBeenCalled();
      expect(result[0].cpf).toBe('12345678901');
    });
  });

  describe('showUserService', () => {
    it('deve retornar o usuário se o CPF for válido e o usuário existir', async () => {
      const mockUser = { cpf: '12345678900', name: 'João', type: 'Cliente' };
      userRepository.findUserByCpf.mockResolvedValue(mockUser);

      const result = await showUserService('123.456.789-00');

      expect(userRepository.findUserByCpf).toHaveBeenCalledWith('12345678900');
      expect(result.cpf).toBe('12345678900');
    });

    it('deve lançar ResponseError 404 se o usuário não for encontrado', async () => {
      userRepository.findUserByCpf.mockResolvedValue(null);
      await expect(showUserService('12345678900')).rejects.toThrow(ResponseError);
    });
  });

  describe('createUserService', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      const userData = { cpf: '12345678901', email: 't@t.com', name: 'J', password: 'password', type: 'Cliente' };
      userRepository.findUserByCpf.mockResolvedValue(null);
      userRepository.findUserByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_password');
      userRepository.createUser.mockResolvedValue({ ...userData, password: 'hashed_password' });

      const result = await createUserService({ ...userData });

      expect(userRepository.createUser).toHaveBeenCalled();
      expect(result.email).toBe('t@t.com');
    });
    it('deve lançar erro se o CPF já estiver cadastrado', async () => {
      userRepository.findUserByCpf.mockResolvedValue({ cpf: '12345678901' });
      await expect(createUserService({ cpf: '12345678901' })).rejects.toThrow('CPF já cadastrado no sistema.');
    });

    it('deve lançar erro se o e-mail já estiver cadastrado', async () => {
      userRepository.findUserByCpf.mockResolvedValue(null);
      userRepository.findUserByEmail.mockResolvedValue({ email: 't@t.com' });
      await expect(createUserService({ cpf: '12345678901', email: 't@t.com' })).rejects.toThrow('E-mail já cadastrado no sistema.');
    });
  });

  describe('updateUserService', () => {
    it('deve atualizar o usuário com sucesso', async () => {
      const existingUser = { cpf: '12345678901', email: 'o@o.com' };
      userRepository.findUserByCpf.mockResolvedValue(existingUser);
      userRepository.updateUser.mockResolvedValue({ ...existingUser, name: 'Novo' });

      const result = await updateUserService('12345678901', { name: 'Novo' });

      expect(userRepository.updateUser).toHaveBeenCalled();
      expect(result.name).toBe('Novo');
    });
    it('deve lançar erro se tentar atualizar para um email que já existe', async () => {
      userRepository.findUserByCpf.mockResolvedValue({ cpf: '12345678901', email: 'o@o.com' });
      userRepository.findUserByEmail.mockResolvedValue({ email: 'new@o.com' });
      await expect(updateUserService('12345678901', { email: 'new@o.com' })).rejects.toThrow('Este novo e-mail já está em uso.');
    });

    it('deve atualizar o email com sucesso se o novo email estiver disponível', async () => {
      userRepository.findUserByCpf.mockResolvedValue({ cpf: '12345678901', email: 'o@o.com' });
      userRepository.findUserByEmail.mockResolvedValue(null);
      userRepository.updateUser.mockResolvedValue({ cpf: '12345678901', email: 'available@o.com' });
      
      const result = await updateUserService('12345678901', { email: 'available@o.com' });
      expect(result.email).toBe('available@o.com');
    });

    it('deve lançar erro se o usuário não for encontrado para atualização', async () => {
      userRepository.findUserByCpf.mockResolvedValue(null);
      await expect(updateUserService('12345678901', { name: 'N' })).rejects.toThrow('Usuário não cadastrado no sistema.');
    });

    it('deve lançar erro se os dados forem inválidos para atualização', async () => {
      await expect(updateUserService('12345678901', {})).rejects.toThrow('Estrutura de dados inválida para atualização.');
    });

    it('deve criptografar a nova senha se fornecida na atualização', async () => {
      const existingUser = { cpf: '12345678901', email: 'o@o.com' };
      userRepository.findUserByCpf.mockResolvedValue(existingUser);
      userRepository.updateUser.mockResolvedValue({ ...existingUser, password: 'new_hashed' });
      bcrypt.hash.mockResolvedValue('new_hashed');

      const result = await updateUserService('12345678901', { password: 'NewPassword123' });

      expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword123', 10);
      expect(result.status).toBeUndefined(); // translateEnums might not have translations here
    });
  });

  describe('deleteUserService', () => {
    it('deve excluir o usuário se ele existir', async () => {
      userRepository.findUserByCpf.mockResolvedValue({ cpf: '12345678901' });
      await deleteUserService('12345678901');
      expect(userRepository.deleteUser).toHaveBeenCalledWith('12345678901');
    });

    it('deve lançar erro se o usuário não for encontrado para exclusão', async () => {
      userRepository.findUserByCpf.mockResolvedValue(null);
      await expect(deleteUserService('12345678901')).rejects.toThrow('Usuário não cadastrado no sistema.');
    });
  });

  describe('reactivateUserService', () => {
    it('deve reativar o usuário se ele existir', async () => {
      userRepository.findUserByCpf.mockResolvedValue({ cpf: '12345678901' });
      await reactivateUserService('12345678901');
      expect(userRepository.reactivateUser).toHaveBeenCalledWith('12345678901');
    });

    it('deve lançar erro se o usuário não for encontrado para reativação', async () => {
      userRepository.findUserByCpf.mockResolvedValue(null);
      await expect(reactivateUserService('12345678901')).rejects.toThrow('Usuário não cadastrado no sistema.');
    });
  });
});
