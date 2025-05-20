const express = require('express');
const ConsultationService = require('../services/ConsultationService')
const router = express.Router();
const consultationService = new ConsultationService();
const authMiddleware = require('../middleware/authMiddleware');

// Rota para listar todas as consultas
router.get('/', async (req, res) => {
  try {
    const consultas = await consultationService.listConsultation();
    res.status(200).json(consultas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para listar consultas do paciente
router.get('/patient', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Buscando consultas para o paciente:', userId);
    const consultas = await consultationService.getConsultationsByPatient(userId);
    console.log('Consultas encontradas:', consultas);
    res.status(200).json(consultas);
  } catch (err) {
    console.error('Erro ao buscar consultas:', err);
    res.status(500).json({ error: err.message });
  }
});

// Rota para criar uma nova consulta
router.post('/', authMiddleware, async (req, res) => {
  console.log('Dados recebidos na rota:', req.body); // Log dos dados recebidos
  const { data, horario, dentista, local, status, servico } = req.body;
  const paciente = req.user.userId; // Usa o ID do usuário autenticado

  // Validação dos dados recebidos
  if (!data || !horario || !dentista || !local || !status || !servico) {
    console.error('Dados inválidos:', { data, horario, dentista, local, status, servico});
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Envia os dados para o serviço
    const newConsultation = await consultationService.createConsultation({ 
      data, 
      horario, 
      paciente, // Usa o ID do usuário autenticado
      dentista, 
      local, 
      status, 
      servico 
    });
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
    if (!consulta) {
      return res.status(404).json({ error: 'Consulta não encontrada.' });
    }
    res.status(200).json(consulta);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar consulta: ' + err.message });
  }
});

// Rota para cancelar uma consulta
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    console.log('Tentando cancelar consulta:', { consultaId: id, userId });

    // Busca a consulta
    const consulta = await consultationService.findConsultationById(id);
    console.log('Consulta encontrada:', consulta);
    
    if (!consulta) {
      return res.status(404).json({ error: 'Consulta não encontrada' });
    }

    // Verifica se a consulta pertence ao usuário
    console.log('Comparando IDs:', { 
      consultaPaciente: consulta.paciente, 
      userId: userId,
      tipos: {
        consultaPaciente: typeof consulta.paciente,
        userId: typeof userId
      }
    });

    if (String(consulta.paciente) !== String(userId)) {
      console.log('IDs não correspondem');
      return res.status(403).json({ error: 'Você não tem permissão para cancelar esta consulta' });
    }

    // Verifica se a consulta já está cancelada
    if (consulta.status === 'cancelado') {
      return res.status(400).json({ error: 'Esta consulta já está cancelada' });
    }

    // Atualiza o status da consulta para cancelado
    const updatedConsultation = await consultationService.updateConsultation(id, { status: 'cancelado' });
    res.status(200).json({ message: 'Consulta cancelada com sucesso', updatedConsultation });
  } catch (error) {
    console.error('Erro ao cancelar consulta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 