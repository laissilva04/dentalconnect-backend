require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');

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
const consultationController = require('./src/controllers/ConsultationController')
const servicesController = require('./src/controllers/ServicesController')
const mailRoutes = require('./src/routes/mail'); 
const localServicosController = require('./src/controllers/LocalServicesController')
const faleConoscoController = require('./src/controllers/FaleConoscoController');
const dentistaServicoController = require('./src/controllers/DentistaServicoController');
const ConsultaController = require('./src/controllers/ConsultaController');


// Conexão das rotas
app.use('/api/consulta', ConsultaController)
app.use('/api/users', userController)
app.use('/api/login', authController)
app.use('/api/locals', localController)
app.use('/api/dentists', dentistController)
app.use('/api/consultation', consultationController)
app.use('/api/services', servicesController)
app.use('/api/mail', mailRoutes);
app.use('/api/locals-services', localServicosController)
app.use('/api/fale-conosco', faleConoscoController);
app.use('/api/dentists-services', dentistaServicoController)

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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse via: http://localhost:${PORT}`);
  console.log(`Acesse via: http://192.168.1.23:${PORT}`);
  console.log(`Acesse via: http://192.168.0.10:${PORT}`);
  console.log(`Servidor configurado para aceitar conexões de qualquer IP`);
});
