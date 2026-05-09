import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { ResponseError } from "../errors/ResponseError.js";
import { findUserByEmail } from "../repository/user.repository.js"
import { validatePassword } from "../utils/validators.utils.js";
import { createPasswordResetToken, findValidResetToken, resetPasswordTransaction } from "../repository/password_reset.repository.js";
import { sendPasswordResetEmail } from "./email.service.js";

const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hora

/*
 Gera e envia o link de recuperação de senha para o e-mail informado.
 A resposta é sempre a mesma (sucesso), independente do e-mail existir ou não para evitar que descubram quais emails estão cadastrados no sistema. 
 */


export const forgotPasswordService = async (email) => {
    const user = await findUserByEmail(email);

    // Se o usuário não existe retorna sucesso mesmo assim
    if (!user || user.excluded_at) return;

    const token = crypto.randomBytes(32).toString('hex');

    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

    await createPasswordResetToken(user.cpf, token, expiresAt);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;


    await sendPasswordResetEmail(email, resetLink);

}


//Valida o token e atualiza a senha do usuário

export const resetPasswordService = async (token, newPassword) => {
    if (!token) throw new ResponseError('Token não informado.', 400);

    const resetToken = await findValidResetToken(token);

    if (!resetToken) {
        throw new ResponseError('Token inválido ou expirado.', 400);
    }

    //Valida requisitos da nova senha
    validatePassword(newPassword);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //Atualiza senha e invalida o token
    await resetPasswordTransaction(resetToken.user_cpf, hashedPassword, resetToken.id);
}