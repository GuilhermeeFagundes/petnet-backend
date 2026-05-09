import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // janela de 15 minutos
    max: 10,
    message: {error: 'Muitas tentativas. Tente novamente em 15 minutos.'},
    standardHeaders: true,
    legacyHeaders: false,
})

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message:{error: 'Muitas requisições. Tente novamente em 15 minutos.'},  
    standardHeaders: true,
    legacyHeaders: false,
})