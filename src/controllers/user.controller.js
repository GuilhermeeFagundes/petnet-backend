import {
    createUserService,
    listUsersService,
    deleteUserService,
    updatePersonalDataService,
    updateAddresService
} from "../services/user.service.js";

export const createUserController = async (req, res) => {
    try {
        const userParam = req.body;

        // validação da entrada dos campos obrigatórios
        if (!userParam.usu_cpf, !userParam.usu_email, !userParam.usu_nome, !userParam.usu_senha) {
            return res.status(400).json({ erro: "Campos obrigatórios (CPF, nome, email e senha) faltando" });
        }

        const user = await createUserService(userParam);

        return res.status(201).json(user);

    } catch (error) {

        // Se o erro for de regra de negócio
        return res.status(400).json({
            erro: error.message
        });
    }
};

export const listUsersController = async (req, res) => {

    try {

        const users = await listUsersService();
        return res.status(200).json(users)

    } catch (erro) {

        return res.status(500).json({ erro: "Erro ao listar os usuário" });

    }
}

export const updatePersonalDataController = async (req, res) => {
    try {
        
        const { usu_cpf } = req.params; 
        
        // Dados novos do corpo da requisição
        const updateData = req.body;

        // Valida se a rota não pasar o CPF 
        if (!usu_cpf) {
            return res.status(400).json({ erro: "CPF não informado na URL." });
        }

        // Valida se o corpo vier vazio 
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ erro: "Nenhum dado fornecido para atualização." });
        }

        const updatedUser = await updatePersonalDataService(usu_cpf, updateData);
        return res.status(200).json(updatedUser);

    } catch (erro) {
        
        return res.status(400).json({ erro: erro.message });
    }
};

export const updateAddresController = async (req, res) => {

    try{
        
        const {usu_cpf, end_id} = req.params;

        const addresData = req.body;

        console.log("Body recebido:", req.body);

        if (Object.keys(addresData).length === 0) {

            return res.status(400).json({ erro: "Nenhum dado fornecido para atualização." });

        }

        const {
            end_tipo,
            end_cep,
            end_cidade,
            end_bairro,
            end_logradouro,
            end_numero
        } = addresData;

        console.log("Variáveis:", { end_tipo, end_cep, end_logradouro });

        if(!end_tipo || !end_cep || !end_cidade || !end_bairro || !end_logradouro || !end_numero){

            return res.status(400).json({ erro: "Todos os campos obrigatórios precisam ser preenchidos." });

        }

        const updatedAddres = await updateAddresService(usu_cpf, end_id, addresData);
        return res.status(200).json(updatedAddres)

    
    }catch (erro){

        return res.status(400).json({ erro: erro.message})

    }
}

export const deleteUserController = async (req, res) => {

    try {

        const {usu_cpf} = req.params;


        if(!usu_cpf){

            return res.status(400).json({ erro: "Campo CPF do usuário faltando" });

        }

        const delUser = await deleteUserService(usu_cpf);
        return res.status(200).json(delUser)

    } catch (erro) {

        return res.status(400).json({ erro: erro.message})

    }
}


