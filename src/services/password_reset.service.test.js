import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { forgotPasswordService, resetPasswordService } from './password_reset.service.js';
import * as userRepository from '../repository/user.repository.js';
import * as passwordResetRepository from '../repository/password_reset.repository.js';
import * as emailService from './email.service.js';
import { ResponseError } from '../errors/ResponseError.js';
import bcrypt from 'bcrypt';
import { generateCpf } from "../utils/test.utils.js";

const TEST_CPF_1 = generateCpf();

jest.mock('../repository/user.repository.js');
jest.mock('../repository/password_reset.repository.js');
jest.mock('./email.service.js');
jest.mock('bcrypt');

describe('Password Reset Service (password_reset.service.js)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('forgotPasswordService', () => {
    it('deve gerar token e enviar e-mail se o usuário existir', async () => {
      userRepository.findUserByEmail.mockResolvedValue({ cpf: TEST_CPF_1 });
      passwordResetRepository.createPasswordResetToken.mockResolvedValue();
      emailService.sendPasswordResetEmail.mockResolvedValue();

      await forgotPasswordService('test@test.com');

      expect(passwordResetRepository.createPasswordResetToken).toHaveBeenCalled();
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalled();
    });

    it('não deve fazer nada se o usuário não existir', async () => {
      userRepository.findUserByEmail.mockResolvedValue(null);
      await forgotPasswordService('test@test.com');
      expect(passwordResetRepository.createPasswordResetToken).not.toHaveBeenCalled();
    });
  });

  describe('resetPasswordService', () => {
    it('deve atualizar a senha se o token for válido', async () => {
      passwordResetRepository.findValidResetToken.mockResolvedValue({ user_cpf: TEST_CPF_1, id: 1 });
      bcrypt.hash.mockResolvedValue('hashed');
      passwordResetRepository.resetPasswordTransaction.mockResolvedValue();

      await resetPasswordService('token_ok', 'NovaSenha123');

      expect(passwordResetRepository.resetPasswordTransaction).toHaveBeenCalledWith(TEST_CPF_1, 'hashed', 1);
    });

    it('deve lançar erro se o token for inválido', async () => {
      passwordResetRepository.findValidResetToken.mockResolvedValue(null);
      await expect(resetPasswordService('token_bad', 'NovaSenha123')).rejects.toThrow(ResponseError);
    });
  });
});
