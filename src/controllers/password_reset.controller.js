import { forgotPasswordService, resetPasswordService } from "../services/password_reset.service.js";


export const forgotPasswordController = async (req, res) => {
    const { email } = req.body;
    await forgotPasswordService(email);

    return res.status(200).json({
        message: 'Se este e-mail estiver cadastrado, você receberá as instruções em breve.',
    });
}

export const resetPasswordController = async(req, res) => {
    const {token, password} = req.body

    await resetPasswordService(token, password);

    return res.status(200).json({ message: 'Senha redefinida com sucesso.' });
}
