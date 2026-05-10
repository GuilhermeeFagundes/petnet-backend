import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { validateEnum, validateAndConvertEnums, translateEnums } from './enum.utils.js';
import { ResponseError } from '../errors/ResponseError.js';

describe('Enum Utils (enum.utils.js)', () => {
  const MockEnum = {
    ACTIVE: 'A',
    INACTIVE: 'I'
  };

  const MockMetadata = {
    key: 'status',
    label: 'Status do Sistema',
    values: MockEnum,
    translations: {
      [MockEnum.ACTIVE]: 'Ativo'
      // MockEnum.INACTIVE ('I') is missing translation
    }
  };

  describe('validateEnum', () => {
    it('deve retornar o valor se for null ou undefined', () => {
      expect(validateEnum(MockMetadata, null)).toBeNull();
      expect(validateEnum(MockMetadata, undefined)).toBeUndefined();
    });

    it('deve lançar erro genérico se os metadados forem inválidos', () => {
      expect(() => validateEnum({}, 'active')).toThrow('Objeto de metadados inválido');
    });

    it('deve encontrar e retornar o valor canônico por busca direta (valor real)', () => {
      expect(validateEnum(MockMetadata, 'A')).toBe('A');
      expect(validateEnum(MockMetadata, 'a')).toBe('A'); // Case insensitive
    });

    it('deve encontrar e retornar o valor canônico pela chave do enum', () => {
      expect(validateEnum(MockMetadata, 'ACTIVE')).toBe('A');
      expect(validateEnum(MockMetadata, 'INACTIVE')).toBe('I');
    });

    it('deve encontrar e retornar o valor canônico através da tradução', () => {
      expect(validateEnum(MockMetadata, 'Ativo')).toBe('A');
    });

    it('deve lançar erro 400 se o valor não for encontrado', () => {
      try {
        validateEnum(MockMetadata, 'desconhecido');
        throw new Error('Deveria lançar ResponseError');
      } catch (error) {
        expect(error).toBeInstanceOf(ResponseError);
        expect(error.httpCode).toBe(400);
        expect(error.message).toContain("Valor 'desconhecido' inválido para o campo 'Status do Sistema'");
      }
    });
  });

  describe('validateAndConvertEnums', () => {
    it('deve validar e substituir a chave original pelo valor canônico no objeto de dados', () => {
      const data = { status: 'Ativo', name: 'Teste' };
      const metadatas = [MockMetadata];

      const result = validateAndConvertEnums(data, metadatas);

      expect(result.status).toBe('A');
      expect(result.name).toBe('Teste');
    });

    it('não deve alterar os dados caso eles sejam nulos ou array de meta seja inválido', () => {
      expect(validateAndConvertEnums(null, [])).toBeNull();
      expect(validateAndConvertEnums({ name: 'A' }, null)).toEqual({ name: 'A' });
    });
  });

  describe('translateEnums', () => {
    it('deve retornar o próprio dado se for null ou metadados inválidos', () => {
      expect(translateEnums(null, [])).toBeNull();
      expect(translateEnums({ a: 1 }, null)).toEqual({ a: 1 });
    });

    it('deve traduzir um enum em um objeto único, mantendo o código original em nova chave', () => {
      const data = { status: 'A', id: 1 };
      const result = translateEnums(data, [MockMetadata]);

      expect(result.status).toBe('Ativo');
      expect(result.status_code).toBe('A');
      expect(result.id).toBe(1);
    });

    it('deve traduzir um array de objetos', () => {
      const data = [{ status: 'A' }, { status: 'I' }];
      const result = translateEnums(data, [MockMetadata]);

      expect(result[0].status).toBe('Ativo');
      expect(result[1].status).toBe('I'); // No translation for 'I'
    });
  });
});
