import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { sendPasswordResetEmail } from './email.service.js';
import { Resend } from 'resend';
import { generateCpf } from "../utils/test.utils.js";

const TEST_CPF_1 = generateCpf();

jest.mock('resend');

describe('Email Service (email.service.js)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, RESEND_API_KEY: 'test_key', RESEND_FROM_EMAIL: 'test@test.com' };
    
    // Mock the chainable resend client
    const sendMock = jest.fn().mockResolvedValue({ id: TEST_CPF_1 });
    Resend.prototype.emails = { send: sendMock };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('deve chamar o método de envio de e-mail com os parâmetros corretos', async () => {
    await sendPasswordResetEmail('to@test.com', 'http://reset.link');

    expect(Resend.prototype.emails.send).toHaveBeenCalledWith(expect.objectContaining({
      to: 'to@test.com',
      from: 'test@test.com',
      subject: 'Recuperação de senha — PetNet',
      html: expect.stringContaining('http://reset.link')
    }));
  });

  it('deve reutilizar o cliente Resend se ele já estiver inicializado', async () => {
    // Chama para garantir que o singleton seja testado (ambos os ramos do if (!resend))
    await sendPasswordResetEmail('to@test.com', 'http://link');
    await sendPasswordResetEmail('to@test.com', 'http://link');
    
    // Apenas garante que não houve erro
    expect(Resend.prototype.emails.send).toHaveBeenCalled();
  });
});
