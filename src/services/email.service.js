import { Resend } from 'resend';
import { ScheduleDurationMetadata } from '../enums/schedule.enums.js';

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

/* Envia o e-mail de lembrete pedindo a confirmação do agendamento do dia seguinte.
@param {object} schedule - Agendamento com id, date_time, duration, observation, client{name,email}, pet{name}, collaborator{name} e services[{name}] */

export const sendScheduleReminderEmail = async (schedule) => {
    const { id, date_time, duration, observation, services,
        client: { name: clientName, email },
        pet: { name: petName },
        collaborator: { name: collaboratorName },
    } = schedule;

    const pad = (n) => String(n).padStart(2, '0');
    const brt = new Date(new Date(date_time).getTime() - 3 * 60 * 60 * 1000);

    const serviceNames = services?.map(s => s.name).join(', ') || 'Serviço não especificado';
    const formattedDate = `${pad(brt.getUTCDate())}/${pad(brt.getUTCMonth() + 1)}/${brt.getUTCFullYear()}`;
    const formattedTime = `${pad(brt.getUTCHours())}:${pad(brt.getUTCMinutes())}`;
    const durationText = ScheduleDurationMetadata.translations[duration] || 'Duração não especificada';
    const observationText = observation || 'Nenhuma observação registrada';
    const confirmationLink = `${process.env.API_BASE_URL}/api/schedules/${id}/confirm`;

    const emailHtml = `
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 16px; background-color: #f4f8ff; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">

            <div style="background-color: #ffffff; border-radius: 16px; padding: 28px 24px; box-shadow: 0 4px 18px rgba(51, 112, 235, 0.08);">

            <img
                style="height: 50px; margin: 0 auto 16px auto; display: block;"
                src="https://www.kindpng.com/picc/m/42-421588_blue-paw-print-blue-paw-print-png-transparent.png"
                alt="Logo NetCão"
            />

            <h2 style="color: #3370EB; text-align: center; font-size: 22px; margin: 0 0 12px;">
                Confirme seu agendamento
            </h2>

            <p style="color: #2b2b2b; margin: 16px 0;">
                Olá, <strong>${clientName}</strong>!
            </p>

            <p style="color: #2b2b2b; line-height: 1.6; margin: 0;">
                Este é um lembrete de que seu agendamento na
                <strong>NetCão</strong> é amanhã. Confira abaixo os detalhes e clique no botão
                para confirmar o atendimento.
            </p>

            <div style="background-color: #f8faff; border: 1px solid #e2eaff; border-radius: 12px; padding: 18px; margin: 22px 0;">
                <p style="margin: 8px 0; color: #2b2b2b;">
                <strong>Pet:</strong> ${petName}
                </p>

                <p style="margin: 8px 0; color: #2b2b2b;">
                <strong>Serviço(s):</strong> ${serviceNames}
                </p>

                <p style="margin: 8px 0; color: #2b2b2b;">
                <strong>Data:</strong> ${formattedDate}
                </p>

                <p style="margin: 8px 0; color: #2b2b2b;">
                <strong>Horário:</strong> ${formattedTime}
                </p>

                <p style="margin: 8px 0; color: #2b2b2b;">
                <strong>Duração estimada:</strong> ${durationText}
                </p>

                <p style="margin: 8px 0; color: #2b2b2b;">
                <strong>Colaborador responsável:</strong> ${collaboratorName}
                </p>

                <p style="margin: 8px 0; color: #2b2b2b;">
                <strong>Observações:</strong> ${observationText}
                </p>
            </div>

            <div style="text-align: center; margin: 26px 0;">
                <a
                href="${confirmationLink}"
                target="_blank"
                style="
                    display: inline-block;
                    text-decoration: none;
                    color: #ffffff;
                    background-color: #3370EB;
                    padding: 13px 28px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 700;
                "
                >
                Confirmar agendamento
                </a>
            </div>

            <p style="color: #555555; font-size: 14px; text-align: center; line-height: 1.5; margin: 0 0 24px;">
                Após clicar no botão, seu agendamento será confirmado automaticamente.
            </p>

            <div style="background-color: #fffbea; border: 1px solid #F9EE7C; border-radius: 12px; padding: 16px; margin: 20px 0;">
                <p style="color: #2b2b2b; line-height: 1.6; margin: 0;">
                <strong>Precisa cancelar ou alterar o agendamento?</strong><br />
                Entre em contato com nossa equipe pelo WhatsApp antes do horário marcado.
                </p>

                <p style="text-align: center; margin: 16px 0 0;">
                <a
                    href="https://wa.me/5512996539100?text=Ol%C3%A1%2C%20preciso%20cancelar%20ou%20alterar%20meu%20agendamento%20na%20NetC%C3%A3o."
                    target="_blank"
                    style="
                    display: inline-block;
                    text-decoration: none;
                    color: #1f2937;
                    background-color: #F9EE7C;
                    padding: 11px 22px;
                    border-radius: 8px;
                    font-weight: 700;
                    "
                >
                    Falar com a NetCão
                </a>
                </p>
            </div>

            <p style="color: #555555; line-height: 1.6; margin: 22px 0 0;">
                Você também pode acompanhar nossos serviços pelo site:
                <a
                href="https://netcao.com.br"
                target="_blank"
                style="color: #3370EB; font-weight: 700; text-decoration: none;"
                >
                netcao.com.br
                </a>
            </p>

            <div style="border-top: 1px solid #e8edf7; margin-top: 26px; padding-top: 20px;">
                <p style="margin: 0; color: #555555; line-height: 1.6;">
                Com carinho,<br />
                <strong style="color: #3370EB;">Equipe NetCão 🐾</strong>
                </p>
            </div>

            </div>

            <p style="text-align: center; color: #888888; font-size: 12px; margin: 18px 0 0;">
            Este é um e-mail automático relacionado ao seu agendamento.
            </p>

        </div>
        </div>
        `;

    await getResendClient().emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: 'Confirmação de agendamento — NetCão',
        html: emailHtml,
    });
};