import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { sanitizeData, sanitizeDataList } from './sanitize.utils.js';

describe('Sanitize Utils (sanitize.utils.js)', () => {
  describe('sanitizeData', () => {
    it('deve retornar null se os dados de entrada forem nulos ou indefinidos', () => {
      const result = sanitizeData(['name'], null);
      expect(result).toBeNull();
    });

    it('deve remover os campos que não estão na lista de permitidos', () => {
      const data = { name: 'Rex', age: 5, secretField: 'secret' };
      const allowed = ['name', 'age'];

      const result = sanitizeData(allowed, data);

      expect(result).toEqual({ name: 'Rex', age: 5 });
      expect(result.secretField).toBeUndefined();
    });

    it('deve ignorar campos permitidos que estejam null ou undefined nos dados originais', () => {
      const data = { name: 'Rex', breed: null, size: undefined };
      const allowed = ['name', 'breed', 'size'];

      const result = sanitizeData(allowed, data);

      expect(result).toEqual({ name: 'Rex' });
      expect(result.breed).toBeUndefined();
      expect(result.size).toBeUndefined();
    });

    it('deve retornar null se, após sanitizar, o objeto ficar vazio', () => {
      const data = { wrongField: 'teste' };
      const allowed = ['name', 'age'];

      const result = sanitizeData(allowed, data);

      expect(result).toBeNull();
    });
  });

  describe('sanitizeDataList', () => {
    it('deve retornar null se a lista de entrada for nula ou indefinida', () => {
      const result = sanitizeDataList(['name'], null);
      expect(result).toBeNull();
    });

    it('deve sanitizar cada item de um array, filtrando campos não permitidos', () => {
      const data = [
        { name: 'Casa', cep: '01001000', secretField: 'x' },
        { name: 'Trabalho', cep: '04538132', secretField: 'y' }
      ];
      const allowed = ['name', 'cep'];

      const result = sanitizeDataList(allowed, data);

      expect(result).toEqual([
        { name: 'Casa', cep: '01001000' },
        { name: 'Trabalho', cep: '04538132' }
      ]);
    });

    it('deve descartar itens do array que ficarem vazios após sanitizar', () => {
      const data = [
        { name: 'Casa', cep: '01001000' },
        { wrongField: 'teste' }
      ];
      const allowed = ['name', 'cep'];

      const result = sanitizeDataList(allowed, data);

      expect(result).toEqual([{ name: 'Casa', cep: '01001000' }]);
    });

    it('deve retornar null se o array de entrada for vazio', () => {
      const result = sanitizeDataList(['name'], []);
      expect(result).toBeNull();
    });

    it('deve retornar null se todos os itens do array ficarem vazios após sanitizar', () => {
      const data = [{ wrongField: 'teste' }, { otherField: 'teste2' }];
      const allowed = ['name'];

      const result = sanitizeDataList(allowed, data);

      expect(result).toBeNull();
    });
  });
});
