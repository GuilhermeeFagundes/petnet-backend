import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { forgotPasswordController, resetPasswordController } from './password_reset.controller.js';
import * as passwordResetService from '../services/password_reset.service.js';

jest.mock('../services/password_reset.service.js');

describe('Password Reset Controller (password_reset.controller.js)', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('forgotPasswordController', () => {
    it('deve chamar o service e retornar status 200 com mensagem de sucesso', async () => {
      req.body = { email: 'user@teste.com' };
      passwordResetService.forgotPasswordService.mockResolvedValue();

      await forgotPasswordController(req, res);

      expect(passwordResetService.forgotPasswordService).toHaveBeenCalledWith('user@teste.com');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Se este e-mail estiver cadastrado, você receberá as instruções em breve.'
      });
    });
  });

  describe('resetPasswordController', () => {
    it('deve chamar o service e retornar status 200 após redefinir a senha', async () => {
      req.body = { token: 'meutoken', password: 'novaSenha123' };
      passwordResetService.resetPasswordService.mockResolvedValue();

      await resetPasswordController(req, res);

      expect(passwordResetService.resetPasswordService).toHaveBeenCalledWith('meutoken', 'novaSenha123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Senha redefinida com sucesso.' });
    });
  });
});
