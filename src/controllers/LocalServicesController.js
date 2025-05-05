const express = require('express');
const router = express.Router();
const localServicosService = require('../services/LocalServicesService');

// Rota para obter todos os locais com seus serviços
router.get('/', async (req, res) => {
  try {
    const result = await localServicosService.getLocaisComServicos();
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Erro no controller ao buscar locais com serviços:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar locais com serviços',
      data: null
    });
  }
});

// Rota para obter serviços de um local específico pelo ID
router.get('/:localId', async (req, res) => {
  try {
    const { localId } = req.params;
    
    const result = await localServicosService.getServicosPorLocalId(localId);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error(`Erro no controller ao buscar serviços do local ${req.params.localId}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar serviços do local',
      data: null
    });
  }
});

module.exports = router;
