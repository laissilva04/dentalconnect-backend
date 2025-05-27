const express = require('express');
const UserService = require('../services/UserService');
const router = express.Router();
const userService = new UserService();
const authentication  = require('../middleware/authentication.midle');
const UserRepository = require('../repositories/UserRepository');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const path = require('path');

const userRepository = new UserRepository();

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuração do Multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // limite de 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Use apenas JPEG, PNG ou GIF.'));
    }
  },
});

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

// Upload de avatar
router.post('/:id/avatar', authentication, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.params.id;
    const file = req.file;

    console.log('Dados da requisição:', {
      userId,
      userFromToken: req.user,
      file: file ? {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      } : null
    });

    if (!file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }

    // Verificar se o usuário está tentando atualizar seu próprio avatar
    const tokenUserId = req.user.userId;
    console.log('Comparando IDs:', {
      tokenUserId: tokenUserId,
      tokenUserIdType: typeof tokenUserId,
      userId: userId,
      userIdType: typeof userId
    });

    if (String(tokenUserId) !== String(userId)) {
      console.log('IDs não correspondem:', {
        userIdFromToken: tokenUserId,
        userIdFromParams: userId
      });
      return res.status(403).json({ message: 'Não autorizado a atualizar avatar de outro usuário' });
    }

    // Gerar nome único para o arquivo
    const fileExt = path.extname(file.originalname);
    const fileName = `${userId}-${Date.now()}${fileExt}`;

    // Upload para o Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) {
      console.error('Erro ao fazer upload para o Supabase:', error);
      return res.status(500).json({ message: 'Erro ao fazer upload da imagem' });
    }

    // Obter URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Atualizar o avatar do usuário no banco de dados
    await userRepository.updateUser(userId, { avatar: publicUrl });

    return res.status(200).json({
      message: 'Avatar atualizado com sucesso',
      avatarUrl: publicUrl
    });
  } catch (error) {
    console.error('Erro ao processar upload do avatar:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
