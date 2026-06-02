import 'dotenv/config'; // Carrega .env antes de tudo — deve ser a primeira linha
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { globalLimiter } from './middlewares/rate_limit.middleware.js';

// ─── Validação de Variáveis de Ambiente Críticas ───────────────────────────
// A aplicação não deve iniciar se variáveis de segurança estiverem ausentes.
const REQUIRED_ENV_VARS = ['JWT_SECRET', 'DATABASE_URL'];
const missingVars = REQUIRED_ENV_VARS.filter(key => !process.env[key]);
if (missingVars.length > 0) {
  console.error(`[FATAL] Variáveis de ambiente ausentes: ${missingVars.join(', ')}. Encerrando.`);
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.error('[FATAL] JWT_SECRET deve ter no mínimo 32 caracteres. Encerrando.');
  process.exit(1);
}
// ───────────────────────────────────────────────────────────────────────────

const app = express();

// Helmet: define headers HTTP de segurança (HSTS, X-Frame-Options, CSP, etc.)
app.use(helmet());
app.disable('x-powered-by');

app.use(express.json());

app.use(globalLimiter);

const allowedOrigins = {
  development: ['http://localhost:5173'],
  production: [
    'https://petnet-pi.netlify.app',
    'https://netcao.com.br',
    'https://www.netcao.com.br',
  ]
};

app.use(cors({
  origin: allowedOrigins[process.env.NODE_ENV] || allowedOrigins.development,
  credentials: true
}));
app.use(cookieParser()); // Habilita leitura de cookies (req.cookies)

// Rota de verificação (Health Check)
app.get('/healthcheck', (req, res) => {
  return res.json("Servidor PetNet está online! 🚀");
});

// Configura o uso das rotas de usuário
// Tudo que chegar em /api vai para o arquivo index.routes.js
app.use('/api', routes);

// O middleware de erro deve vir DEPOIS das rotas
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
    Servidor rodando na porta ${PORT} 🚀

    http://localhost:${PORT}/healthcheck
  `);
});