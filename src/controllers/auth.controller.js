import { registerService, loginService } from '../services/auth.service.js';
import { cookieOptions } from '../utils/cookie.utils.js';
import { requireFields, validateEmail } from '../utils/validators.utils.js';

export const registerController = async (req, res) => {
    requireFields(req.body, ['cpf', 'email', 'name', 'password']);
    validateEmail(req.body.email);

    const { token, user } = await registerService(req.body);
    res.cookie('token', token, cookieOptions);
    return res.status(201).json({ user });
};

export const loginController = async (req, res) => {
    requireFields(req.body, ['email', 'password']);
    validateEmail(req.body.email);

    const { email, password } = req.body;
    const { token, user } = await loginService(email, password);

    res.cookie('token', token, cookieOptions);
    return res.status(200).json({ message: 'Login realizado com sucesso.', user });
};

export const logoutController = (req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
    return res.status(200).json({ message: 'Logout realizado com sucesso.' });
};
