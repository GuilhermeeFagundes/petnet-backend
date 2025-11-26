const express = require('express');
const app = express();

app.use(express.json());

app.get('/teste', (req, res) => {
    res.status(200).json({
        msg: 'teste!'
    });
});
    

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})