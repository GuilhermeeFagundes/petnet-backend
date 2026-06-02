import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { requireFields, parseId, cleanCpf, validatePassword, validateEmail } from './validators.utils.js';
import { ResponseError } from '../errors/ResponseError.js';
import fc from 'fast-check';
import { generateCpf } from "./test.utils.js";

const TEST_CPF_1 = generateCpf();

describe('Validator Utils (validators.utils.js)', () => {
  describe('requireFields', () => {
    it('deve passar sem erros quando todos os campos obrigatórios estão presentes', () => {
      const data = { name: 'João', age: 30 };
      expect(() => requireFields(data, ['name', 'age'])).not.toThrow();
    });

    it('deve lançar um erro 400 se algum campo obrigatório estiver ausente ou vazio', () => {
      const data = { name: 'João', age: '' };
      try {
        requireFields(data, ['name', 'age']);
        throw new Error('Deveria ter lançado ResponseError');
      } catch (error) {
        expect(error).toBeInstanceOf(ResponseError);
        expect(error.httpCode).toBe(400);
        expect(error.message).toContain('Campos obrigatórios faltando: age');
      }
    });

    it('deve lançar erro 400 listando múltiplos campos faltantes', () => {
      const data = { name: 'João' };
      try {
        requireFields(data, ['name', 'age', 'email']);
        throw new Error('Deveria ter lançado ResponseError');
      } catch (error) {
        expect(error.message).toContain('age, email');
      }
    });
  });

  describe('parseId', () => {
    it('deve retornar um número quando passado um ID válido em formato de string', () => {
      const id = parseId(TEST_CPF_1, 'ID Usuário');
      expect(id).toBe(Number(TEST_CPF_1));
    });

    it('deve lançar um erro 400 se o ID não for um número válido (ex: letras)', () => {
      try {
        parseId('abc', 'ID Usuário');
        throw new Error('Deveria ter lançado ResponseError');
      } catch (error) {
        expect(error).toBeInstanceOf(ResponseError);
        expect(error.httpCode).toBe(400);
        expect(error.message).toContain("ID Usuário inválido: 'abc'");
      }
    });

    it('deve lançar um erro 400 se o ID for menor ou igual a zero', () => {
      try {
        parseId('0');
        throw new Error('Deveria ter lançado ResponseError');
      } catch (error) {
        expect(error.message).toContain("ID inválido: '0'");
      }
    });
  });

  describe('cleanCpf', () => {
    it('deve remover todos os caracteres não numéricos de um CPF válido', () => {
      const cpf = `${TEST_CPF_1.slice(0, 3)}.${TEST_CPF_1.slice(3, 6)}.${TEST_CPF_1.slice(6, 9)}-${TEST_CPF_1.slice(9, 11)}`;
      const result = cleanCpf(cpf);
      expect(result).toBe(TEST_CPF_1);
    });

    it('deve lançar erro 400 se o CPF não tiver 11 dígitos', () => {
      const cpfInvalido = '123.456.789-0';
      try {
        cleanCpf(cpfInvalido);
        throw new Error('Deveria ter lançado ResponseError');
      } catch (error) {
        expect(error).toBeInstanceOf(ResponseError);
        expect(error.httpCode).toBe(400);
        expect(error.message).toBe('CPF deve conter exatamente 11 dígitos');
      }
    });

    it('deve lançar erro se o CPF for uma sequência repetida', () => {
      expect(() => cleanCpf('00000000000')).toThrow('CPF inválido.');
    });

    it('deve lançar erro se o primeiro dígito verificador for inválido', () => {
      const invalidCpf = TEST_CPF_1.slice(0, 9) + (parseInt(TEST_CPF_1[9]) === 9 ? '0' : '9') + TEST_CPF_1[10];
      expect(() => cleanCpf(invalidCpf)).toThrow('CPF inválido.');
    });

    it('deve lançar erro se o segundo dígito verificador for inválido', () => {
      const invalidCpf = TEST_CPF_1.slice(0, 10) + (parseInt(TEST_CPF_1[10]) === 9 ? '0' : '9');
      expect(() => cleanCpf(invalidCpf)).toThrow('CPF inválido.');
    });

    it('deve validar um CPF cujo resto do dígito verificador seja 10', () => {
      // O CPF 10000000108 tem o cálculo do primeiro dígito resultando em resto 10 (que vira 0)
      const validCpfRem10 = '10000000108';
      expect(cleanCpf(validCpfRem10)).toBe(validCpfRem10);
    });

    it('PROPRIEDADE: para qualquer CPF válido, a limpeza com ruído deve retornar apenas os 11 dígitos', () => {
      fc.assert(
        fc.property(
          fc.constant(TEST_CPF_1),
          fc.array(fc.stringMatching(/^[^0-9]$/), { maxLength: 10 }),
          (digits, noise) => {
            // Intercala ruído nos dígitos
            let input = digits;
            noise.forEach(char => {
              const pos = Math.floor(Math.random() * input.length);
              input = input.slice(0, pos) + char + input.slice(pos);
            });

            const result = cleanCpf(input);
            return result === digits && result.length === 11;
          }
        )
      );
    });
  });

  describe('validateEmail', () => {
    it('deve passar se o email for válido', () => {
      expect(() => validateEmail('test@example.com')).not.toThrow();
    });

    it('deve lançar erro se o email for inválido', () => {
      expect(() => validateEmail('test@')).toThrow('Formato de e-mail inválido.');
    });

    it('deve lançar erro se o email não for fornecido', () => {
      expect(() => validateEmail('')).toThrow('Formato de e-mail inválido.');
    });
  });

  describe('validatePassword', () => {
    it('deve passar quando a senha atende todos os requisitos', () => {
      expect(() => validatePassword('SenhaForte123')).not.toThrow();
    });

    it('deve lançar erro 400 se a senha tiver menos de 8 caracteres', () => {
      try {
        validatePassword('Curta1');
        throw new Error('Deveria ter lançado ResponseError');
      } catch (error) {
        expect(error.message).toBe('A senha deve ter no mínimo 8 caracteres.');
      }
    });

    it('deve lançar erro se a senha não for fornecida', () => {
      expect(() => validatePassword('')).toThrow('A senha deve ter no mínimo 8 caracteres.');
    });

    it('deve lançar erro 400 se não tiver letra maiúscula', () => {
      try {
        validatePassword('fraca123');
        throw new Error('Deveria ter lançado ResponseError');
      } catch (error) {
        expect(error.message).toBe('A senha deve conter pelo menos 1 letra maiúscula.');
      }
    });

    it('deve lançar erro 400 se não tiver letra minúscula', () => {
      try {
        validatePassword('FRACA123');
        throw new Error('Deveria ter lançado ResponseError');
      } catch (error) {
        expect(error.message).toBe('A senha deve conter pelo menos 1 letra minúscula.');
      }
    });

    it('deve lançar erro 400 se não tiver número', () => {
      try {
        validatePassword('SenhaFracaSemNumero');
        throw new Error('Deveria ter lançado ResponseError');
      } catch (error) {
        expect(error.message).toBe('A senha deve conter pelo menos 1 número.');
      }
    });

    it('PROPRIEDADE: qualquer senha válida gerada deve passar na validação', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 8 }).filter(s => 
            /[A-Z]/.test(s) && /[a-z]/.test(s) && /[0-9]/.test(s)
          ),
          (password) => {
            expect(() => validatePassword(password)).not.toThrow();
          }
        )
      );
    });

    it('PROPRIEDADE: qualquer string sem números deve falhar na validação (ou por falta de número ou por outro critério)', () => {
      fc.assert(
        fc.property(
          fc.string().filter(s => !/[0-9]/.test(s)),
          (password) => {
            try {
              validatePassword(password);
              return false; // Não deveria passar
            } catch (error) {
              return true; // Falhou como esperado
            }
          }
        )
      );
    });
  });
});
