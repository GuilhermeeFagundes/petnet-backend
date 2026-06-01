import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { base64ToBuffer, bufferToBase64, mapBlobToField, mapFieldToBlob } from './image.utils.js';

describe('Image Utils (image.utils.js)', () => {
  describe('base64ToBuffer', () => {
    it('deve retornar null se receber null ou undefined', () => {
      expect(base64ToBuffer(null)).toBeNull();
      expect(base64ToBuffer(undefined)).toBeNull();
    });

    it('deve converter uma string base64 simples para Buffer', () => {
      const base64Str = 'data:image/png;base64,SGVsbG8='; // 'Hello'
      const buffer = base64ToBuffer(base64Str);
      
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.toString()).toBe('Hello');
    });

    it('deve remover o prefixo data:image/... antes de converter para Buffer', () => {
      const base64Str = 'data:image/png;base64,SGVsbG8=';
      const buffer = base64ToBuffer(base64Str);
      
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.toString()).toBe('Hello');
    });

    it('deve lançar erro se o tipo MIME for inválido', () => {
      const invalidBase64 = 'data:image/svg+xml;base64,PHN2Zz4=';
      expect(() => base64ToBuffer(invalidBase64)).toThrow('Tipo de imagem não suportado. Use JPEG, PNG, WebP ou GIF.');
    });

    it('deve lançar erro se a imagem for maior que 5MB', () => {
      // 5MB + 1 byte
      const largeBuffer = Buffer.alloc(5 * 1024 * 1024 + 1);
      const largeBase64 = `data:image/png;base64,${largeBuffer.toString('base64')}`;
      expect(() => base64ToBuffer(largeBase64)).toThrow('Imagem muito grande. Limite máximo de 5MB.');
    });
  });

  describe('bufferToBase64', () => {
    it('deve retornar null se receber null', () => {
      expect(bufferToBase64(null)).toBeNull();
    });

    it('deve converter um Buffer para uma string Base64 com prefixo padrão png', () => {
      const buffer = Buffer.from('Hello');
      const result = bufferToBase64(buffer);
      
      expect(result).toBe('data:image/png;base64,SGVsbG8=');
    });

    it('deve converter um Buffer utilizando o mimeType informado', () => {
      const buffer = Buffer.from('Hello');
      const result = bufferToBase64(buffer, 'image/jpeg');
      
      expect(result).toBe('data:image/jpeg;base64,SGVsbG8=');
    });
  });

  describe('mapBlobToField', () => {
    it('deve retornar a própria entidade se ela for null', () => {
      expect(mapBlobToField(null)).toBeNull();
    });

    it('deve converter picture_blob para string base64 e remover a chave original', () => {
      const entity = { id: 1, picture_blob: Buffer.from('Hello') };
      
      const result = mapBlobToField(entity, 'petPicture');
      
      expect(result.petPicture).toBe('data:image/png;base64,SGVsbG8=');
      expect(result.picture_blob).toBeUndefined();
    });

    it('não deve alterar a entidade se não houver picture_blob', () => {
      const entity = { id: 1, name: 'Rex' };
      const result = mapBlobToField(entity, 'petPicture');
      
      expect(result).toEqual({ id: 1, name: 'Rex' });
      expect(result.petPicture).toBeUndefined();
    });
  });

  describe('mapFieldToBlob', () => {
    it('deve retornar os mesmos dados se os dados forem null', () => {
      expect(mapFieldToBlob(null)).toBeNull();
    });

    it('deve converter a string base64 do campo informado para picture_blob e remover o campo original', () => {
      const data = { name: 'Rex', petPicture: 'data:image/png;base64,SGVsbG8=' };
      const result = mapFieldToBlob(data, 'petPicture');
      
      expect(result.name).toBe('Rex');
      expect(result.picture_blob).toBeInstanceOf(Buffer);
      expect(result.petPicture).toBeUndefined();
    });

    it('deve setar picture_blob como undefined caso a imagem não venha no payload', () => {
      const data = { name: 'Rex' };
      const result = mapFieldToBlob(data, 'petPicture');
      
      expect(result.name).toBe('Rex');
      expect(result.picture_blob).toBeUndefined();
    });
  });
});
