const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao banco de dados');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Exemplo de rota
app.use(express.static(path.join(__dirname, 'view'))); 
// Rota para servir o index.html 
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'view', 'index.html')); });

app.get('/test-db', (req, res) => { db.query('SELECT 1 + 1 AS solution',(err, results) => { if (err) { return res.status(500).send('Erro na conexão com o banco de dados'); } 
res.send(`A solução é: ${results[0].solution}`); }); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
