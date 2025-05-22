const express = require('express');
const UserService = require('../services/UserService');
const router = express.Router();
const userService = new UserService();
const authentication  = require('../middleware/authentication.midle');
const UserRepository = require('../repositories/UserRepository');

const userRepository = new UserRepository();

// Rota para listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const { tipo } = req.query;
    if (tipo) {
      const users = await userService.listUsersByType(tipo);
      res.status(200).json(users);
    } else {
      const users = await userService.listUsers();
      res.status(200).json(users);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para criar um novo usuário
router.post("/", async (req, res) => {
  console.log("Dados recebidos na rota:", req.body);
  const { nome, email, senha, data_nascimento, tipo, cpf, cidade, estado, cro} = req.body;

  if (!nome || !email || !senha || !data_nascimento || !tipo || !cpf || !cidade || !estado) {
    console.error("Dados inválidos:", { nome, email, senha, data_nascimento, tipo });
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });  
  }

  if (!["paciente", "dentista"].includes(tipo)) {
    return res.status(400).json({ error: "Tipo de usuário inválido. Deve ser 'paciente' ou 'dentista'." });
  }

  try {
    const newUser = await userService.registerUser({ nome, email, senha, data_nascimento, tipo, cpf, cidade, estado, cro});
    res.status(201).json({ message: "Usuário criado com sucesso!", newUser });
  } catch (err) {
    console.error("Erro na criação do usuário:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar usuario: ' + err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar local esportivo: ' + err.message });
  }
});

// Buscar usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Buscando usuário com ID:", userId);
    
    const user = await userRepository.findById(userId);
    console.log("Dados do usuário encontrado:", user);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Remover dados sensíveis
    const { senha, ...userWithoutPassword } = user;
    
    // Garantir que o avatar seja uma string ou null
    userWithoutPassword.avatar = user.avatar || null;
    
    console.log("Dados do usuário retornados:", userWithoutPassword);
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
