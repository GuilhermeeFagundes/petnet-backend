import prisma from '../prisma.js';

// criar usuários
export const createUser = async (dadoUsuario) => {
    // DEBUG: Adicione este log
    console.log("Dados chegando no repositório:", dadoUsuario);

    return await prisma.usu_usuarios.create({
        data: dadoUsuario, // Aqui é onde o erro diz que está faltando
    });
};

// listar todos os usuários
export const listUsers = async () => {

    return await prisma.usu_usuarios.findMany();

}