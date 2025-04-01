const express = require('express');
const LocalService = require('../services/LocalService');
const router = express.Router();
const localService = new LocalService();

// Rota para listar todos os locais
router.get('/', async (req, res) => {
  try {
    const locais = await localService.listLocais();
    res.status(200).json(locais);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para criar um novo local
router.post('/', async (req, res) => {
  console.log('Dados recebidos na rota:', req.body); // Log dos dados recebidos
  const { nome, endereco, numero, cidade, estado } = req.body;

  // Validação dos dados recebidos
  if (!nome || !endereco || !numero || !cidade || !estado) {
    console.error('Dados inválidos:', { nome, endereco, numero, cidade, estado });
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Envia os dados para o serviço
    const newLocal = await localService.createLocal({ nome, endereco, numero, cidade, estado });
    res.status(201).json({ message: 'Local criado com sucesso!', newLocal });
  } catch (err) {
    console.error('Erro na criação do local:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Rota para atualizar um local existente
router.put('/:id', async (req, res) => {
  try {
    const updatedLocal = await localService.updateLocal(req.params.id, req.body);
    res.status(200).json(updatedLocal);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar local: ' + err.message });
  }
});

// Rota para deletar um local
router.delete('/:id', async (req, res) => {
  try {
    await localService.deleteLocal(req.params.id);
    res.status(204).send(); // Não retorna corpo, apenas o status 204 de sucesso
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar local: ' + err.message });
  }
});

// Rota para buscar um local pelo ID
router.get('/:id', async (req, res) => {
  try {
    const local = await localService.findLocalById(req.params.id);
    if (!local) {
      return res.status(404).json({ error: 'Local não encontrado.' });
    }
    res.status(200).json(local);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar local: ' + err.message });
  }
});

module.exports = router;