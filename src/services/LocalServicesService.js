const localServicosRepository = require('../repositories/LocalServicesRepository');

class LocalServicosService {
  async getLocaisComServicos() {
    try {
      const { data, error } = await localServicosRepository.getLocaisComServicos();
      
      if (error) throw error;
      
      return {
        success: true,
        data,
        message: 'Locais com serviços obtidos com sucesso'
      };
    } catch (error) {
      console.error('Erro no serviço ao buscar locais com serviços:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Erro ao buscar locais com serviços'
      };
    }
  }

  async getServicosPorLocalId(localId) {
    try {
      if (!localId) {
        throw new Error('ID do local não fornecido');
      }
      
      const { data, error } = await localServicosRepository.getServicosPorLocalId(localId);
      
      if (error) throw error;
      
      return {
        success: true,
        data,
        message: 'Serviços do local obtidos com sucesso'
      };
    } catch (error) {
      console.error(`Erro no serviço ao buscar serviços do local ${localId}:`, error);
      return {
        success: false,
        data: null,
        message: error.message || `Erro ao buscar serviços do local ${localId}`
      };
    }
  }
}

module.exports = new LocalServicosService();
