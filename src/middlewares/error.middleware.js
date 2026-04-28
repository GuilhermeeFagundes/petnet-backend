import { ResponseError } from '../errors/ResponseError.js';

export const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ResponseError) {
    return res.status(err.httpCode).json({ error: err.message });
  }

  // Erros conhecidos do Prisma
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Conflito de dados: este registro já existe.' });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'O recurso solicitado não foi encontrado.' });
  }

  // Log de erros inesperados (importante para debug)
  console.error(' [Unexpected Error]:', err);

  return res.status(500).json({ 
    error: 'Ocorreu um erro inesperado no servidor.' 
  });
};
