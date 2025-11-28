import { createUserService, listUsersService} from "../services/user.service.js";

export const createUserController = async (req, res) => {
    try {
        const userParam = req.body;

        // validação da entrada dos campos obrigatórios
        if (!userParam.usu_cpf, !userParam.usu_email, !userParam.usu_nome, !userParam.usu_senha ) {
            return res.status(400).json({ erro: "Campos obrigatórios (CPF, nome, email e senha) faltando" });
        }
        
        const user = await createUserService(userParam);
        
        return res.status(201).json(user);

    } catch (error) {
        
        // Se o erro for de regra de negócio
        return res.status(400).json({ 
            erro: error.message });
    }
};

export const listUsersController = async (req, res) => {
    
    try {

        const users = await listUsersService();
        return res.status(200).json(users)

    }  catch(erro){

        return res.status(500).json({erro : "Erro ao listar os usuário"});

    }
}

