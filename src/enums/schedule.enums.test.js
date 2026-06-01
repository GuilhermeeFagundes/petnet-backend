import { describe, it, expect } from '@jest/globals';
import {
  ScheduleStatus,
  ScheduleDuration,
  ScheduleStatusMetadata,
  ScheduleDurationMetadata,
  ScheduleEnums,
} from './schedule.enums.js';

describe('Schedule Enums (schedule.enums.js)', () => {
  describe('ScheduleStatus', () => {
    it('deve conter todos os 5 status esperados', () => {
      expect(Object.keys(ScheduleStatus)).toHaveLength(5);
    });

    it.each([
      ['SCHEDULED', 'SCHEDULED'],
      ['CONFIRMED', 'CONFIRMED'],
      ['CANCELED', 'CANCELED'],
      ['FINISHED', 'FINISHED'],
      ['DELIVERED', 'DELIVERED'],
    ])('deve ter a chave %s com valor "%s"', (key, value) => {
      expect(ScheduleStatus[key]).toBe(value);
    });
  });

  describe('ScheduleStatusMetadata', () => {
    it('deve ter key "status"', () => {
      expect(ScheduleStatusMetadata.key).toBe('status');
    });

    it('deve ter label "Status do Agendamento"', () => {
      expect(ScheduleStatusMetadata.label).toBe('Status do Agendamento');
    });

    it('deve referenciar o objeto ScheduleStatus como values', () => {
      expect(ScheduleStatusMetadata.values).toBe(ScheduleStatus);
    });

    it('deve ter tradução para todos os valores do enum', () => {
      const statusKeys = Object.values(ScheduleStatus);
      const translatedKeys = Object.keys(ScheduleStatusMetadata.translations);

      statusKeys.forEach((status) => {
        expect(translatedKeys).toContain(status);
      });
    });

    it.each([
      ['SCHEDULED', 'Agendado'],
      ['CONFIRMED', 'Confirmado'],
      ['CANCELED', 'Cancelado'],
      ['FINISHED', 'Finalizado'],
      ['DELIVERED', 'Entregue'],
    ])('deve traduzir %s para "%s"', (key, translation) => {
      expect(ScheduleStatusMetadata.translations[key]).toBe(translation);
    });
  });

  describe('ScheduleDuration', () => {
    it('deve conter todos os 7 valores de duração', () => {
      expect(Object.keys(ScheduleDuration)).toHaveLength(7);
    });
  });

  describe('ScheduleDurationMetadata', () => {
    it('deve ter key "duration"', () => {
      expect(ScheduleDurationMetadata.key).toBe('duration');
    });

    it('deve ter tradução para todos os valores do enum', () => {
      const durationKeys = Object.values(ScheduleDuration);
      const translatedKeys = Object.keys(ScheduleDurationMetadata.translations);

      durationKeys.forEach((duration) => {
        expect(translatedKeys).toContain(duration);
      });
    });
  });

  describe('ScheduleEnums', () => {
    it('deve exportar um array com ScheduleDurationMetadata e ScheduleStatusMetadata', () => {
      expect(ScheduleEnums).toHaveLength(2);
      expect(ScheduleEnums).toContain(ScheduleDurationMetadata);
      expect(ScheduleEnums).toContain(ScheduleStatusMetadata);
    });
  });
});
