import { registerService, loginService } from '../services/auth.service.js';
import { cookieOptions } from '../utils/cookie.utils.js';

export const registerController = async (req, res) => {
    try {
        const { token, user } = await registerService(req.body);
        res.cookie('token', token, cookieOptions);
        return res.status(201).json({ message: 'Conta criada com sucesso.', user });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await loginService(email, password);
    
        res.cookie('token', token, cookieOptions);
        return res.status(200).json({ message: 'Login realizado com sucesso.', user });
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};

export const logoutController = (req, res) => {
    // Limpa o cookie sem precisar conhecer o token (basta sobrescrever com maxAge: 0)
    res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
    return res.status(200).json({ message: 'Logout realizado com sucesso.' });
};
