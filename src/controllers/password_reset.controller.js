import { forgotPasswordService, resetPasswordService } from "../services/password_reset.service.js";
import { requireFields } from "../utils/validators.utils.js";

export const forgotPasswordController = async (req, res) => {
    requireFields(req.body, ['email']);

    await forgotPasswordService(req.body.email);

    return res.status(200).json({
        message: 'Se este e-mail estiver cadastrado, você receberá as instruções em breve.',
    });
};

export const resetPasswordController = async (req, res) => {
    requireFields(req.body, ['token', 'password']);

    const { token, password } = req.body;
    await resetPasswordService(token, password);

    return res.status(200).json({ message: 'Senha redefinida com sucesso.' });
};
