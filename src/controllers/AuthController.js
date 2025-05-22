const express = require('express')
const AuthService = require('../services/AuthService')

const authService = new AuthService();

const router = express.Router();

//Rota de Login 
router.post('/', async (req, res) => {
  
    const { email, senha } = req.body;
    
    try {
        const { token, user, tipo, nome, avatar, email: userEmail } = await authService.loginUser({ email, senha });
    
        console.log("Dados retornados do login:", { token, user, tipo, nome, avatar, email: userEmail });

        return res.status(200).json({
          message: 'Login realizado com sucesso!',
          token,
          user,
          tipo,
          nome,
          avatar,
          email: userEmail
        });
      } catch (error) {
        if (error.message === 'Email e senha são obrigatórios.' || 
            error.message === 'Credenciais inválidas.') {
            return res.status(400).json({ message: error.message });
        }

        console.error('Erro no login:', error.message);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router; 