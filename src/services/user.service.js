import {
    createUser,
    findUserByCpf,
    findUserByEmail,
    listUsers,
    deleteUser,
    updatePersonalDate,
    updateAddres,
} from '../repository/user.repository.js';

export const createUserService = async (userData) => {

    // 1. Extração de TODAS as variáveis necessárias
    const { 
        usu_cpf, 
        usu_nome, 
        usu_email, 
        usu_senha, 
        usu_tipo, 
        usu_foto_url,
        endereco, 
        contato   
    } = userData;

    
    const cpfExist = await findUserByCpf(usu_cpf); 
    if(cpfExist){
        throw new Error("CPF já cadastrado no sistema!");
    }

    const emailExist = await findUserByEmail(usu_email);
    if(emailExist) {
        throw new Error("Email já cadastrado no sistema!");
    }

    // 3. Montagem do Objeto para o Prisma (Nested Writes)
    // Aqui usamos uma nova variável 'inputDat'
    const inputData = {
        usu_cpf,
        usu_nome,
        usu_email,
        usu_senha,
        usu_tipo,
        usu_foto_url,
        
        // Lógica: Só cria o endereço se vier dados E se for Cliente (segurança extra)
        end_endereco: (usu_tipo === 'Cliente' && endereco) ? {
            create: {
                end_cep: endereco.cep,
                end_logradouro: endereco.logradouro,
                end_numero: endereco.numero,
                end_bairro: endereco.bairro,
                end_cidade: endereco.cidade,
                end_estado: endereco.estado,
                end_tipo: endereco.tipo || "Residencial"
            }
        } : undefined,

        con_contato: (usu_tipo === 'Cliente' && contato) ? {
            create: {
                con_nome: contato.nome,
                con_telefone: contato.telefone
            }
        } : undefined
    };
    
    // 4. Configuração do Retorno (Include)
    const includeOption = {};

    if(usu_tipo === 'Cliente'){
        includeOption.end_endereco = true; 
        includeOption.con_contato = true;
    }

    // 5. Chamada ao Repositório
    const newUser = await createUser(inputData, includeOption);

    return newUser;
}

export const listUsersService = async() => {

    const users = await listUsers();

    return users;

}

export const updatePersonalDataService = async (userCPF, updateData) => {

    // Passo 1: Verificar se o usuário existe
    const userExists = await findUserByCpf(userCPF);

    if (!userExists) {
        throw new Error("CPF não cadastrado no sistema.");
    }

    // Passo 2: Extrair os dados que queremos atualizar
    // 'updateData' é o objeto que vem do req.body (ex: { usu_nome: "Novo Nome", ... })
    const { 
        usu_nome, 
        usu_email, 
        con_telefone 
    } = updateData;

    // Passo 3: (Opcional) Se o usuário estiver mudando de e-mail,
    // validar se o novo e-mail já não pertence a outra pessoa.
    if (usu_email && usu_email !== userExists.usu_email) {
        const emailTaken = await findUserByEmail(usu_email);
        if (emailTaken) {
            throw new Error("Este novo e-mail já está em uso.");
        }
    }

    // Passo 4: Chamar o repositório passando os dados na ordem que definimos lá
    const userUpdated = await updatePersonalDate(
        userCPF, 
        usu_nome, 
        usu_email, 
        con_telefone
    );

    return userUpdated;
};

export const updateAddresService = async(userCPF, addresID, addresData) => {

    const findUser = await findUserByCpf(userCPF);

    if(!findUser){

        throw new Error("CPF não existe!");

    }


    const newAddres = await updateAddres(userCPF,addresID, addresData);

    if (newAddres.count === 0) {

        throw new Error("Endereço não encontrado ou não pertence a este usuário.");

    }

     return { 
        mensagem: "Endereço atualizado com sucesso",
        dados: addresData 
    };


}

export const deleteUserService = async(userCPF) => {

    const findUser =  await findUserByCpf(userCPF);

    if(!findUser){

        throw new Error("CPF não cadastrado");
        

    }

    const delUser = await deleteUser(userCPF);

    return delUser;


}
