import { Router } from 'express';
import { createUserController, showUserController, listUsersController, deleteUserController, reactivateUserController, updateUserController, clearUserPictureController } from '../controllers/user.controller.js';
import { ensureAdmin, ensureAdminOrSelf } from '../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.get('/', ensureAdmin, listUsersController);                             // só Gerente lista todos
userRouter.get('/:user_cpf', ensureAdminOrSelf, showUserController);              // dono ou admin
userRouter.post('/', ensureAdmin, createUserController);                                        // público — criação de conta
userRouter.put('/:user_cpf', ensureAdminOrSelf, updateUserController);            // dono ou admin
userRouter.delete('/:user_cpf', ensureAdminOrSelf, deleteUserController);               // só admin
userRouter.patch('/reactivate/:user_cpf', ensureAdmin, reactivateUserController);         // só admin
userRouter.delete('/:user_cpf/picture', ensureAdminOrSelf, clearUserPictureController); // dono ou admin

export default userRouter;