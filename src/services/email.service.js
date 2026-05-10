import { Resend } from 'resend';

let resend;
const getResendClient = () => {
    if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
    return resend;
};


/*Envia o e-mail de recuperação de senha.
@param {string} toEmail - E-mail do destinatário
@param {string} resetLink - Link completo com o token (ex: https://petnet.com/reset?token=abc123) */

export const sendPasswordResetEmail = async (toEmail, resetLink) => {
    await getResendClient().emails.send({
        from: process.env.RESEND_FROM_EMAIL, // ex: 'PetNet <noreply@petnet.com.br>'
        to: toEmail,
        subject: 'Recuperação de senha — PetNet',
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
                <h2>Recuperação de senha</h2>
                <p>Recebemos uma solicitação para redefinir a senha da sua conta PetNet.</p>
                <p>Clique no botão abaixo para criar uma nova senha. O link é válido por <strong>1 hora</strong>.</p>
                <a href="${resetLink}"
                   style="display:inline-block; margin-top:16px; padding:12px 24px;
                          background-color:#4f46e5; color:#fff; border-radius:6px;
                          text-decoration:none; font-weight:bold;">
                    Redefinir senha
                </a>
                <p style="margin-top:24px; color:#6b7280; font-size:13px;">
                    Se você não solicitou isso, ignore este e-mail. Sua senha permanece a mesma.
                </p>
                <p style="color:#6b7280; font-size:13px;">
                    Ou copie o link: <a href="${resetLink}">${resetLink}</a>
                </p>
            </div>
        `,
    });
};