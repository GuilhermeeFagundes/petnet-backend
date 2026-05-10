import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { generateToken, verifyToken } from './jwt.utils.js';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JWT Utils (jwt.utils.js)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, JWT_SECRET: 'secret', JWT_EXPIRES_IN: '1h' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('generateToken', () => {
    it('deve chamar jwt.sign com o payload e configurações corretas', () => {
      const payload = { cpf: '12345678900', type: 'Cliente' };
      jwt.sign.mockReturnValue('token_mockado');

      const result = generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, 'secret', { expiresIn: '1h' });
      expect(result).toBe('token_mockado');
    });
  });

  describe('verifyToken', () => {
    it('deve chamar jwt.verify com o token e segredo corretos', () => {
      const token = 'meu_token';
      const mockDecoded = { cpf: '12345678900' };
      jwt.verify.mockReturnValue(mockDecoded);

      const result = verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, 'secret');
      expect(result).toEqual(mockDecoded);
    });

    it('deve repassar o erro lançado pelo jwt.verify caso o token seja inválido', () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Token inválido');
      });

      expect(() => verifyToken('token_ruim')).toThrow('Token inválido');
    });
  });
});
