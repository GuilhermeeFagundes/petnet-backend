import 'dotenv/config'; // Carrega .env antes de tudo — deve ser a primeira linha
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js'; // Importa as rotas (e não o controller direto)

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser()); // Habilita leitura de cookies (req.cookies)

// Rota de verificação (Health Check)
app.get('/healthcheck', (req, res) => {
  return res.json("Servidor PetNet está online! 🚀");
});

// Configura o uso das rotas de usuário
// Tudo que chegar em /api vai para o arquivo index.routes.js
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
    Servidor rodando na porta ${PORT} 🚀

    http://localhost:${PORT}/healthcheck
  `);
});