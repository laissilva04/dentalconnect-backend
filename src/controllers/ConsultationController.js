const express = require('express');
const ConsultationService = require('../services/ConsultationService')
const router = express.Router();
const consultationService = new ConsultationService();

// Rota para listar todas as consultas
router.get('/', async (req, res) => {
  try {
    const consultas = await consultationService.listConsultation();
    res.status(200).json(consultas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para criar uma nova consulta
router.post('/', async (req, res) => {
  console.log('Dados recebidos na rota:', req.body); // Log dos dados recebidos
  const { data, horario, paciente, dentista, local, status } = req.body;

  // Validação dos dados recebidos
  if (!data || !horario || !paciente || !dentista || !local || !status) {
    console.error('Dados inválidos:', { data, horario, paciente, dentista, local, status });
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Envia os dados para o serviço
    const newConsultation = await consultationService.createConsultation({ data, horario, paciente, dentista, local, status });
    res.status(201).json({ message: 'Consulta criada com sucesso!', newConsultation });
  } catch (err) {
    console.error('Erro na criação da consulta:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Rota para atualizar uma consulta existente
router.put('/:id', async (req, res) => {
  try {
    const updatedConsultation = await consultationService.updateConsultation(req.params.id, req.body);
    res.status(200).json(updatedConsultation);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar consulta: ' + err.message });
  }
});

// Rota para deletar uma consulta
router.delete('/:id', async (req, res) => {
  try {
    await consultationService.deleteConsultation(req.params.id);
    res.status(204).send(); // Não retorna corpo, apenas o status 204 de sucesso
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar consulta: ' + err.message });
  }
});

// Rota para buscar uma consulta pelo ID
router.get('/:id', async (req, res) => {
  try {
    const consulta = await consultationService.findConsultationById(req.params.id);
    if (![consulta]) {
      return res.status(404).json({ error: 'Consulta não encontrado.' });
    }
    res.status(200).json(consulta);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar consulta: ' + err.message });
  }
});

module.exports = router;