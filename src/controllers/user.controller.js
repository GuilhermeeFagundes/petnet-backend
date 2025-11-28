import { createUser, listUsers} from "../repository/user.repository.js";

export const createUserController = async (req, res) => {
    try {
        const userParam = req.body;

        // DEBUG: Adicione este log para ver se os dados estão chegando
        console.log("Dados recebidos no controller:", userParam);

        if (!userParam) {
            return res.status(400).json({ erro: "Corpo da requisição vazio" });
        }
        
        const user = await createUser(userParam);
        
        return res.status(201).json(user);
    } catch (error) {
        console.error("Erro no controller:", error);
        return res.status(500).json({ erro: "Erro ao criar usuário", detalhe: error.message });
    }
};

export const listUsersController = async (req, res) => {
    
    const users = await listUsers();

    return res.status(200).json(users)

}

