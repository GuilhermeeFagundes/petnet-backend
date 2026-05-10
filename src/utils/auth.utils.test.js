import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { isAdmin, isSelf, isCollaboratorOrAdmin } from './auth.utils.js';

describe('Auth Utils (auth.utils.js)', () => {
  describe('isAdmin', () => {
    it('deve retornar true se o tipo de usuário for Gerente', () => {
      expect(isAdmin({ type: 'Gerente' })).toBe(true);
    });

    it('deve retornar false se o tipo de usuário não for Gerente', () => {
      expect(isAdmin({ type: 'Cliente' })).toBe(false);
      expect(isAdmin({ type: 'Colaborador' })).toBe(false);
    });
  });

  describe('isSelf', () => {
    it('deve retornar true se o CPF do usuário for igual ao CPF do parâmetro', () => {
      expect(isSelf({ cpf: '12345678901' }, '12345678901')).toBe(true);
    });

    it('deve retornar false se o CPF do usuário for diferente do CPF do parâmetro', () => {
      expect(isSelf({ cpf: '12345678901' }, '45678901234')).toBe(false);
    });
  });

  describe('isCollaboratorOrAdmin', () => {
    it('deve retornar true se o tipo for Colaborador ou Gerente', () => {
      expect(isCollaboratorOrAdmin({ type: 'Colaborador' })).toBe(true);
      expect(isCollaboratorOrAdmin({ type: 'Gerente' })).toBe(true);
    });

    it('deve retornar false se o tipo for Cliente', () => {
      expect(isCollaboratorOrAdmin({ type: 'Cliente' })).toBe(false);
    });
  });
});
