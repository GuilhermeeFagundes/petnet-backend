import { ResponseError } from '../errors/ResponseError.js';
import { sendLog } from '../utils/log.utils.js';

export const errorMiddleware = async (err, req, res, next) => {
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

  const entityMap = { pets: 'pet', schedules: 'schedule', users: 'user'};
  const fullPath = (req.baseUrl + req.path) || '';
  const rawEntity = fullPath.split('/').filter(segment => isNaN(segment) && segment !== '').pop() || 'unknown';

  await sendLog({
    
    entity: entityMap[rawEntity] || rawEntity,
    action: req.method?.toLowerCase() || 'unknown',
    status: 'error',
    responsible: req.user?.cpf || null,
    details: err.message,
  });

  // Log sanitizado: apenas campos seguros para evitar vazamento de dados sensíveis
  // (queries SQL, stack traces com paths internos, dados do req.body, etc.)
  console.error('[Unexpected Error]', {
    message: err.message,
    code: err.code,
    path: req.path,
    method: req.method,
  });

  return res.status(500).json({
    error: 'Ocorreu um erro inesperado no servidor.'
  });
};
