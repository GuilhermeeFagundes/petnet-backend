import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { isAdmin, isSelf, isCollaboratorOrAdmin } from './auth.utils.js';

describe('Auth Utils (auth.utils.js)', () => {
  describe('isAdmin', () => {
    it('deve retornar true se o tipo de usuário for MANAGER', () => {
      expect(isAdmin({ type: 'MANAGER' })).toBe(true);
    });

    it('deve retornar false se o tipo de usuário não for MANAGER', () => {
      expect(isAdmin({ type: 'CUSTOMER' })).toBe(false);
      expect(isAdmin({ type: 'COLLABORATOR' })).toBe(false);
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
    it('deve retornar true se o tipo for COLLABORATOR ou MANAGER', () => {
      expect(isCollaboratorOrAdmin({ type: 'COLLABORATOR' })).toBe(true);
      expect(isCollaboratorOrAdmin({ type: 'MANAGER' })).toBe(true);
    });

    it('deve retornar false se o tipo for CUSTOMER', () => {
      expect(isCollaboratorOrAdmin({ type: 'CUSTOMER' })).toBe(false);
    });
  });
});
