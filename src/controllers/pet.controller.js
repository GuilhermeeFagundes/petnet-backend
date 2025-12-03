import { listPetsService, findPetByIdService, createPetService, updatePetService, deletePetService } from "../services/pet.service.js";

//Listar todos
export const listPetsController = async (req, res) => {
    try {
        const pets = await listPetsService();
        return res.status(200).json(pets);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao listar pets" });
    }
}

//Buscar por ID
export const findPetByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID do pet não informado" });
        }

        const pet = await findPetByIdService(id);
        /*
        Somente com autenticação funcionando
        if (pet.pet_usu_cpf !== req.user.usu_cpf) {
            return res.status(403).json({ erro: "Acesso negado" });
        }
        */
        return res.status(200).json(pet);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

// Criar Pet
export const createPetController = async (req, res) => {
    try {
        const petParams = req.body;
        const { user_cpf, name, species, size } = petParams;

        // validação da entrada dos campos obrigatórios
        if (!user_cpf || !name || !species || !size) {
            return res.status(400).json({ error: "Campos obrigatórios faltando. (cpf, name, species e size)" });
        }

        const newPet = await createPetService(petParams);

        return res.status(201).json(newPet);

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

// Atualizar Pet
export const updatePetController = async (req, res) => {
    try {
        const { id } = req.params;
        const petParams = req.body;

        if (!id) {
            return res.status(400).json({ error: "ID não informado na URL." });
        }

        const updatedPet = await updatePetService(id, petParams);

        return res.status(200).json(updatedPet);
    } catch (err) {
        return res.status(400).json({ erro: err.message });
    }
}

// Deletar Pet
export const deletePetController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID não informado na URL." });
        }

        await deletePetService(id);

        return res.status(200).json({ message: "Pet excluído com sucesso" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}