const express = require('express');
const DentistaServicoService = require('../services/DentistaServicoService');
const router = express.Router();
const dentistaServicoService = new DentistaServicoService();
const authentication = require('../middleware/authentication.midle');

// Rota para listar todos os dentistas com seus serviços
router.get('/', authentication, async (req, res) => {
  try {
    const result = await dentistaServicoService.getDentistasComServicos();
    res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao buscar dentistas com serviços:', error.message);
    res.status(500).json({ error: 'Erro ao buscar dentistas com serviços.' });
  }
});

// Rota para listar serviços de um dentista específico
router.get('/:dentistaId', authentication, async (req, res) => {
  try {
    const { dentistaId } = req.params;
    const result = await dentistaServicoService.getServicosPorDentistaId(dentistaId);

    if (!result) {
      return res.status(404).json({ error: 'Serviços não encontrados para o dentista.' });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(`Erro ao buscar serviços do dentista ${req.params.dentistaId}:`, error.message);
    res.status(500).json({ error: 'Erro ao buscar serviços do dentista.' });
  }
});

module.exports = router;
