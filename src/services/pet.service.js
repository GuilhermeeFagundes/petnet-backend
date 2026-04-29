import petRepository from "../repository/pet.repository.js";
import { sanitizeData } from "../middlewares/utils.middleware.js";
import { base64ToBuffer, bufferToBase64 } from "../utils/image.utils.js";
import { ResponseError } from "../errors/ResponseError.js";
import { validateAndConvertEnums, translateEnums } from "../utils/enum.utils.js";
import { PetEnums } from "../enums/pet.enums.js";

export const listPetsService = async () => {
    const pets = await petRepository.listPets();
    
    return pets.map(pet => {
        if (pet.picture_blob) {
            pet.petPicture = bufferToBase64(pet.picture_blob);
            delete pet.picture_blob;
        }
        return translateEnums(pet, PetEnums);
    });
}

export const findPetsByUserService = async (userCpf) => {
    const pets = await petRepository.findPetsByUserCpf(userCpf);
    
     return pets.map(pet => {
        if (pet.picture_blob) {
            pet.petPicture = bufferToBase64(pet.picture_blob);
            delete pet.picture_blob;
        }
        return translateEnums(pet, PetEnums);
     });
}

export const findPetByIdService = async (petId) => {
    const pet = await petRepository.findPetById(petId);

    if (!pet) throw new ResponseError("Pet não encontrado", 404);

    if (pet.picture_blob) {
        pet.petPicture = bufferToBase64(pet.picture_blob);
        delete pet.picture_blob;
    }

    return translateEnums(pet, PetEnums);
}

export const createPetService = async (petData) => {
    const { petPicture, ...rest } = petData;

    const petWithPicture = {
        ...rest,
        picture_blob: petPicture ? base64ToBuffer(petPicture) : null
    };

    const allowedFields = ["user_cpf", "name", "species", "breed", "size", "birth_date", "weight", "sex", "picture_blob", "observations"];
    const createData = sanitizeData(allowedFields, petWithPicture);

    if (!createData || Object.keys(createData).length === 0) {
        throw new ResponseError("Dados inválidos para criação do pet", 400);
    }

    // Validação e Conversão de Enums (entrada)
    validateAndConvertEnums(createData, PetEnums);

    const newPet = await petRepository.createPet(createData);
    return translateEnums(newPet, PetEnums);
}

export const updatePetService = async (petId, petData) => {
    const { petPicture, ...rest } = petData;

    const petWithPicture = {
        ...rest,
        picture_blob: petPicture ? base64ToBuffer(petPicture) : undefined
    };

    const allowedFields = ["name", "species", "breed", "size", "birth_date", "weight", "sex", "picture_blob", "observations"];
    const updateData = sanitizeData(allowedFields, petWithPicture);

    //Verifica se foram enviados campos válidos
    if (!updateData || Object.keys(updateData).length === 0) {
        throw new ResponseError("Nenhum campo válido enviado para atualização", 400);
    }

    // Validação e Conversão de Enums (entrada)
    validateAndConvertEnums(updateData, PetEnums);

    // Verifica se o pet existe
    const petExists = await petRepository.findPetById(petId);

    if (!petExists) {
        throw new ResponseError("Pet não encontrado", 404);
    }

    // Atualiza somente os campos filtrados
    const updatedPet = await petRepository.updatePet(petId, updateData);
    return translateEnums(updatedPet, PetEnums);
}

export const deletePetService = async (petId) => {
    const pet = await petRepository.findPetById(petId);

    if (!pet) {
        throw new ResponseError("Pet não encontrado", 404);
    }

    await petRepository.deletePet(petId);
}


