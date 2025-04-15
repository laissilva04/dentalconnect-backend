require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Configura o cliente Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

// Middleware
app.use(express.json());
app.use(cors({
  origin: true
})); // Permitir acesso ao front-end

// Importação dos controllers
const userController = require('./src/controllers/UserController')
const authController = require('./src/controllers/AuthController')
const localController = require('./src/controllers/LocalController')
const dentistController = require('./src/controllers/DentistController')

// Conexão das rotas
app.use('/api/users', userController)
app.use('/api/login', authController)
app.use('/api/locals', localController)
app.use('/api/dentists', dentistController)

// Rota principal
app.get("/", (req, res) => {
  res.send("Servidor rodando");
});

// // Rota protegida
// app.get("/protegido", authMiddleware, (req, res) => {
//   res.json({ message: "Você acessou uma rota protegida!", user: req.user });
// });

// Inicia o servidor na porta 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor na porta http://localhost:${PORT}`);
});

/* teste push */