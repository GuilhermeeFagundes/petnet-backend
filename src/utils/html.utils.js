/* Monta a página HTML exibida ao cliente após clicar no link de confirmação de agendamento
recebido por e-mail. Mantém a navegação transparente: o usuário nunca vê JSON na tela.
@param {object} params - title, message e isError (true para o estado de falha) */

export const renderConfirmationPage = ({ title, message, isError = false }) => {
  const accentColor = isError ? '#D64545' : '#3370EB';

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>NetCão - ${title}</title>
      </head>
      <body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f4f8ff; margin: 0; padding: 0;">
        <div style="max-width: 480px; margin: 60px auto; padding: 24px 16px;">
          <div style="background-color: #ffffff; border-radius: 16px; padding: 32px 24px; box-shadow: 0 4px 18px rgba(51, 112, 235, 0.08); text-align: center;">
            <h2 style="color: ${accentColor}; font-size: 22px; margin: 0 0 16px;">${title}</h2>
            <p style="color: #2b2b2b; line-height: 1.6; margin: 0;">${message}</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
