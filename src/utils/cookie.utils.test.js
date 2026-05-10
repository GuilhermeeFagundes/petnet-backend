import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
// Para testar o process.env de forma correta, não podemos apenas importar o módulo,
// precisamos fazer o reset do módulo ou apenas confiar na leitura do env.
// Como cookie.utils.js exporta a constante na inicialização, usaremos require() dinâmico.

describe('Cookie Utils (cookie.utils.js)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Limpa cache para que o módulo seja reavaliado
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('deve configurar secure=true e sameSite=none em ambiente de production', async () => {
    process.env.NODE_ENV = 'production';
    
    let cookieUtils;
    jest.isolateModules(() => {
      cookieUtils = require('./cookie.utils.js');
    });

    expect(cookieUtils.cookieOptions.httpOnly).toBe(true);
    expect(cookieUtils.cookieOptions.secure).toBe(true);
    expect(cookieUtils.cookieOptions.sameSite).toBe('none');
  });

  it('deve configurar secure=false e sameSite=lax em ambiente que não seja production', async () => {
    process.env.NODE_ENV = 'development';
    
    let cookieUtils;
    jest.isolateModules(() => {
      cookieUtils = require('./cookie.utils.js');
    });

    expect(cookieUtils.cookieOptions.httpOnly).toBe(true);
    expect(cookieUtils.cookieOptions.secure).toBe(false);
    expect(cookieUtils.cookieOptions.sameSite).toBe('lax');
  });
});
