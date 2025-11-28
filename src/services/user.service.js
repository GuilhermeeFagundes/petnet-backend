import {
    createUser,
    findeUserByCpf,
    findUserByEmail,
    listUsers
} from '../repository/user.repository.js';

export const createUserService = async (userData) => {

    const  {usu_cpf, usu_email} = userData;


    const cpfExist = await findeUserByCpf(usu_cpf);
    if(cpfExist){
        throw new Error("CPF já cadastrado no sistema!");
    }

    // RN15 : O cadastro de cliente deve exigir validação de e-mail como obrigatório.
    const emailExist = await findUserByEmail(usu_email);
    if(emailExist) {
        throw new Error("Email já cadastrado no sistema!");
    }

    const newUser = await createUser(userData);

    return newUser;

}

export const listUsersService = async() => {

    const users = await listUsers();

    return users;

}
