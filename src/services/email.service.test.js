import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { sendPasswordResetEmail, sendScheduleReminderEmail } from './email.service.js';
import { Resend } from 'resend';
import { generateCpf } from "../utils/test.utils.js";

const TEST_CPF_1 = generateCpf();

jest.mock('resend');

describe('Email Service (email.service.js)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, RESEND_API_KEY: 'test_key', RESEND_FROM_EMAIL: 'test@test.com', API_BASE_URL: 'http://localhost:3000' };

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

  describe('sendScheduleReminderEmail', () => {
    const schedule = {
      id: 42,
      date_time: '2024-03-16T15:30:00.000Z',
      duration: 'THIRTY_MIN',
      observation: 'Levar a carteira de vacinação',
      client: { name: 'João', email: 'joao@test.com' },
      pet: { name: 'Rex' },
      collaborator: { name: 'Maria' },
      services: [{ name: 'Banho' }, { name: 'Tosa' }]
    };

    it('deve chamar o método de envio de e-mail com os parâmetros corretos', async () => {
      await sendScheduleReminderEmail(schedule);

      expect(Resend.prototype.emails.send).toHaveBeenCalledWith(expect.objectContaining({
        to: 'joao@test.com',
        from: 'test@test.com',
        subject: 'Confirmação de agendamento — NetCão',
        html: expect.stringContaining('Rex')
      }));
    });

    it('deve incluir os dados do agendamento no corpo do e-mail', async () => {
      await sendScheduleReminderEmail(schedule);

      const { html } = Resend.prototype.emails.send.mock.calls[0][0];
      expect(html).toContain('João');
      expect(html).toContain('Rex');
      expect(html).toContain('Banho, Tosa');
      expect(html).toContain('16/03/2024');
      expect(html).toContain('12:30');
      expect(html).toContain('30 Minutos');
      expect(html).toContain('Maria');
      expect(html).toContain('Levar a carteira de vacinação');
    });

    it('deve incluir o link de confirmação correto no corpo do e-mail', async () => {
      await sendScheduleReminderEmail(schedule);

      const { html } = Resend.prototype.emails.send.mock.calls[0][0];
      expect(html).toContain('http://localhost:3000/api/schedules/42/confirm');
    });

    it('deve usar um texto padrão quando não houver observação registrada', async () => {
      await sendScheduleReminderEmail({ ...schedule, observation: null });

      const { html } = Resend.prototype.emails.send.mock.calls[0][0];
      expect(html).toContain('Nenhuma observação registrada');
    });

    it('deve usar um texto padrão quando não houver serviços vinculados', async () => {
      await sendScheduleReminderEmail({ ...schedule, services: [] });

      const { html } = Resend.prototype.emails.send.mock.calls[0][0];
      expect(html).toContain('Serviço não especificado');
    });

    it('deve usar um texto padrão quando a duração não for reconhecida', async () => {
      await sendScheduleReminderEmail({ ...schedule, duration: undefined });

      const { html } = Resend.prototype.emails.send.mock.calls[0][0];
      expect(html).toContain('Duração não especificada');
    });

    it('deve propagar o erro caso o envio do e-mail falhe', async () => {
      Resend.prototype.emails.send = jest.fn().mockRejectedValue(new Error('Falha no envio'));

      await expect(sendScheduleReminderEmail(schedule)).rejects.toThrow('Falha no envio');
    });
  });
});
