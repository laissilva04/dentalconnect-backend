const express = require('express');
const DentistService = require('../services/DentistService');
const router = express.Router();
const dentistService = new DentistService();
const authentication = require('../middleware/authentication.midle');

// Rota para listar todos os dentistas
router.get('/', authentication, async (req, res) => {
  try {
    const dentists = await dentistService.listDentists();
    res.status(200).json(dentists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para criar um novo dentista
router.post('/', authentication, async (req, res) => {
  console.log('Dados recebidos na rota:', req.body);
  const { id_usuario, numero_cro } = req.body;

  // Validação dos dados recebidos
  if (!id_usuario || !numero_cro) {
    console.error('Dados inválidos:', { id_usuario, numero_cro });
    return res.status(400).json({ error: 'ID do usuário e número do CRO são obrigatórios.' });
  }

  try {
    // Validação adicional do formato do CRO (exemplo simples)
    if (!/^[A-Za-z]{2}\d{6}$/.test(numero_cro)) {
      return res.status(400).json({ error: 'Formato do CRO inválido. Use o padrão XX999999.' });
    }

    const newDentist = await dentistService.createDentist({ id_usuario, numero_cro });
    res.status(201).json({ message: 'Dentista criado com sucesso!', newDentist });
  } catch (err) {
    console.error('Erro na criação do dentista:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Rota para atualizar um dentista
router.put('/:id', authentication, async (req, res) => {
  try {
    // Verifica se o ID foi fornecido
    if (!req.params.id) {
      return res.status(400).json({ error: 'ID do dentista é obrigatório.' });
    }

    const updatedDentist = await dentistService.updateDentist(req.params.id, req.body);
    res.status(200).json(updatedDentist);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar dentista: ' + err.message });
  }
});

// Rota para deletar um dentista
router.delete('/:id', authentication, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'ID do dentista é obrigatório.' });
    }

    await dentistService.deleteDentist(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar dentista: ' + err.message });
  }
});

// Rota para buscar dentista pelo ID do usuário
router.get('/usuario/:id_usuario', authentication, async (req, res) => {
  try {
    const dentist = await dentistService.findDentistByUserId(req.params.id_usuario);
    if (!dentist) {
      return res.status(404).json({ error: 'Dentista não encontrado para este usuário.' });
    }
    res.status(200).json(dentist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para buscar dentista pelo número do CRO
router.get('/cro/:numero_cro', authentication, async (req, res) => {
  try {
    const dentist = await dentistService.findDentistByCro(req.params.numero_cro);
    if (!dentist) {
      return res.status(404).json({ error: 'Dentista não encontrado com este CRO.' });
    }
    res.status(200).json(dentist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;