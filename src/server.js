import 'dotenv/config'; // Carrega .env antes de tudo — deve ser a primeira linha
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js'; // Importa as rotas (e não o controller direto)
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());

const allowedOrigins = {
  development: ['http://localhost:5173'],
  production: [
    'https://petnet-pi.netlify.app',
    'https://netcao.com.br',
    'https://www.netcao.com.br',
  ]
}

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