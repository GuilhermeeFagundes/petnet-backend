import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { sanitizeData } from './sanitize.utils.js';

describe('Sanitize Utils (sanitize.utils.js)', () => {
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
