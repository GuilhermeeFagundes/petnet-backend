import petRepository from "../repository/pet.repository.js";

export const listPetsService = async () => {
    return await petRepository.listPets();
};


export const findPetByIdService = async (id) => {
    const pet = await petRepository.findPetById(id);

    if (!pet) throw new Error("Pet não encontrado");

    return pet;
}


export const createPetService = async (data) => {
    const { pet_raca, pet_especie, pet_nome, pet_data_nascimento } = data;

    //RN02: Clientes devem cadastrar o pet apenas com os campos obrigatórios (raça, espécie, nome e data de nascimento).

    if (!pet_nome || !pet_raca || !pet_especie || !pet_data_nascimento) {
        throw new Error("Campos obrigatórios: nome, raça, espécie e data de nascimento");
    }

    return await petRepository.createPet(data);
};

export const updatePetService = async (id, data) => {

    //Campos que podem ser atualizados
    const allowedFields = [
        "pet_nome",
        "pet_especie",
        "pet_raca",
        "pet_porte",
        "pet_data_nascimento",
        "pet_peso",
        "pet_sexo",
        "pet_foto_url",
        "pet_observacoes"
    ];

    const updateData = {};

    //Verifica se os campos permitidos foram enviados e se não estão vazios
    for (const key of allowedFields) {
        if (data[key] !== undefined && data[key] !== "") {
            updateData[key] = data[key];
        }
    }

    //Verifica se foram enviados campos válidos
    if (Object.keys(updateData).length === 0) {
        throw new Error("Nenhum campo válido enviado");

    }

    // Verifica se o pet existe
    const petExists = await petRepository.findPetById(id);

    if (!petExists) {
        throw new Error("Pet não encontrado");
    }

     // Atualiza somente os campos filtrados
    return await petRepository.updatePet(id, updateData);
}

export const deletePetService = async (id) => {
    const pet = await petRepository.findPetById(id);

    if (!pet) {
        throw new Error("Pet não encontrado");
    }

    await petRepository.deletePet(id);
}


