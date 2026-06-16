import { jest, describe, it, expect, beforeEach, afterAll, afterEach } from '@jest/globals';
import { parseDateField, ensureDate, getReminderDateRange } from './date.utils.js';
import fc from 'fast-check';

describe('Date Utils (date.utils.js)', () => {
  describe('parseDateField', () => {
    it('deve converter um campo string de data para um objeto Date', () => {
      const data = { birth_date: '2023-01-01T00:00:00.000Z' };
      const result = parseDateField(data, 'birth_date');
      
      expect(result.birth_date).toBeInstanceOf(Date);
      expect(result.birth_date.toISOString()).toBe('2023-01-01T00:00:00.000Z');
    });

    it('deve manter o valor intacto se o campo não for uma string (ex: já for Date)', () => {
      const existingDate = new Date('2023-01-01T00:00:00.000Z');
      const data = { birth_date: existingDate };
      const result = parseDateField(data, 'birth_date');
      
      expect(result.birth_date).toBe(existingDate);
    });

    it('deve manter o objeto intacto se o campo não existir nos dados', () => {
      const data = { name: 'Rex' };
      const result = parseDateField(data, 'birth_date');
      
      expect(result).toEqual({ name: 'Rex' });
    });

    it('PROPRIEDADE: para qualquer string de data ISO válida, parseDateField deve converter corretamente', () => {
      fc.assert(
        fc.property(fc.date({ min: new Date('1970-01-01'), max: new Date('2100-01-01') }).filter(d => !isNaN(d.getTime())), (date) => {
          const isoString = date.toISOString();
          const data = { birth_date: isoString };
          const result = parseDateField(data, 'birth_date');
          return result.birth_date instanceof Date && result.birth_date.getTime() === date.getTime();
        })
      );
    });
  });

  describe('ensureDate', () => {
    it('deve retornar a mesma instância se já for um objeto Date', () => {
      const existingDate = new Date();
      const result = ensureDate(existingDate);
      
      expect(result).toBe(existingDate);
    });

    it('deve converter uma string válida para um novo objeto Date', () => {
      const dateString = '2023-01-01T00:00:00.000Z';
      const result = ensureDate(dateString);
      
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe(dateString);
    });

    it('PROPRIEDADE: ensureDate deve ser idempotente (Date -> Date)', () => {
      fc.assert(
        fc.property(fc.date({ min: new Date('1970-01-01'), max: new Date('2100-01-01') }).filter(d => !isNaN(d.getTime())), (date) => {
          const result1 = ensureDate(date);
          const result2 = ensureDate(result1);
          return result1 === result2 && result1 instanceof Date;
        })
      );
    });
  });

  describe('getReminderDateRange', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('deve retornar o momento atual como início e o fim do dia de amanhã em horário de Brasília (UTC-3)', () => {
      jest.useFakeTimers().setSystemTime(new Date('2024-03-15T15:00:00.000Z'));

      const { start, end } = getReminderDateRange();

      expect(start.toISOString()).toBe('2024-03-15T15:00:00.000Z');
      expect(end.toISOString()).toBe('2024-03-17T02:59:59.999Z');
    });

    it('deve considerar a virada do dia em horário de Brasília, não em UTC, para calcular o fim do intervalo', () => {
      // 2024-03-15T01:00:00Z ainda é 2024-03-14 22:00 em Brasília (UTC-3)
      jest.useFakeTimers().setSystemTime(new Date('2024-03-15T01:00:00.000Z'));

      const { start, end } = getReminderDateRange();

      expect(start.toISOString()).toBe('2024-03-15T01:00:00.000Z');
      expect(end.toISOString()).toBe('2024-03-16T02:59:59.999Z');
    });
  });
});
