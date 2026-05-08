import prisma from '../../prisma/prisma.js';

/* cria token de recuperação de senha e invalida todos os tokens anteriores do usuário */

export const createPasswordResetToken = async(userCpf, token, expiresAt) => {
    //invalida token anteriores

    await prisma.password_reset_token.updateMany({
        where: {
            user_cpf : userCpf,
            used_at: null
        },
        data: {used_at: new Date()},
    })

    return await prisma.password_reset_token.create({
        data: {
            user_cpf: userCpf,
            token,
            expires_at: expiresAt,
        },
    })
}

// Busca um token válido (não usado e não expirado).
export const findValidResetToken = async(token) => {
    return await prisma.password_reset_token.findFirst({
        where: {
            token,
            used_at: null,
            expires_at: {gt: new Date()}, //data de expiração maior que agora
        },
    })
}


// redefine a senha e marca token como usado
export const resetPasswordTransaction = async(userCpf, hashedPassword, tokenId ) => {
    return await prisma.$transaction([
        prisma.user.update({
            where: {cpf: userCpf},
            data: {password: hashedPassword},
        }),
        prisma.password_reset_token.update({
            where:{ id: tokenId},
            data: {used_at: new Date()},
        })
    ])
}