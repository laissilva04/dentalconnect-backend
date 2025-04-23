const express = require('express');
const ServicesService = require('../services/ServicesService');

const servicesService = new ServicesService();

const router = express.Router();

// Rota para listar todos os serviços
router.get('/', async (req, res) => {
  try {
    const services = await servicesService.listServices();
    res.status(200).json(services);
  } catch (error) {
    console.error('Erro ao listar serviços:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para criar um novo serviço
router.post('/', async (req, res) => {
  const { nome, descricao } = req.body;

  try {
    const newService = await servicesService.createService({ nome, descricao });
    res.status(201).json({
      message: 'Serviço criado com sucesso!',
      service: newService
    });
  } catch (error) {
    if (error.message === 'Nome e descrição são obrigatórios.') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Erro ao criar serviço:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para buscar um serviço por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const service = await servicesService.findServiceById(id);
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }
    res.status(200).json(service);
  } catch (error) {
    if (error.message === 'O ID do serviço é obrigatório.') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Erro ao buscar serviço:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para atualizar um serviço
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedService = await servicesService.updateService(id, updates);
    res.status(200).json({
      message: 'Serviço atualizado com sucesso!',
      service: updatedService
    });
  } catch (error) {
    if (error.message === 'O ID do serviço é obrigatório.' || 
        error.message === 'Pelo menos um campo (nome ou descrição) deve ser fornecido para atualização.') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Erro ao atualizar serviço:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para deletar um serviço
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await servicesService.deleteService(id);
    res.status(200).json({ message: 'Serviço deletado com sucesso!' });
  } catch (error) {
    if (error.message === 'O ID do serviço é obrigatório.') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Erro ao deletar serviço:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para buscar serviços por nome
router.get('/search/:nome', async (req, res) => {
  const { nome } = req.params;

  try {
    const services = await servicesService.searchServicesByName(nome);
    res.status(200).json(services);
  } catch (error) {
    if (error.message === 'O termo de busca é obrigatório.') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Erro ao buscar serviços:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;