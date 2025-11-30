import { listPetsService, findPetByIdService, createPetService, updatePetService, deletePetService } from "../services/pet.service.js";

//Listar todos
export const listPetsController = async (req, res) => {
    try {
        const pets = await listPetsService();
        return res.status(200).json(pets);
    } catch (err) {
        return res.status(500).json({ erro: "Erro ao listar pets" });
    }

};

//Buscar por ID
export const findPetByIdController = async (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido" });
    }

    try {
        const pet = await findPetByIdService(id);
        /*
        Somente com autenticação funcionando
        if (pet.pet_usu_cpf !== req.user.usu_cpf) {
            return res.status(403).json({ erro: "Acesso negado" });
        }
        */
        return res.status(200).json(pet);
    } catch (err) {
        return res.status(404).json({ erro: err.message });
    }

}

// Criar Pet
export const createPetController = async (req, res) => {
    try {
        const newPet = await createPetService(req.body);
        return res.status(201).json(newPet);
    } catch (err) {
        return res.status(400).json({ erro: err.message });
    }
}


// Atualizar Pet
export const updatePetController = async (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido" });
    }

    try {
        const updatedPet = await updatePetService(id, req.body);
        return res.status(200).json(updatedPet);
    } catch (err) {
        return res.status(400).json({ erro: err.message });
    }
}


// Deletar Pet
export const deletePetController = async (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido" });
    }

    try {
        await deletePetService(id);
        return res.status(200).json({ mensagem: "Pet excluído com sucesso" });
    } catch (err) {
        return res.status(400).json({ erro: err.message });
    }
}