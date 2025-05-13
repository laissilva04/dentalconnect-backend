const DentistaServicoRepository = require('../repositories/DentistaServicoRepository');

class DentistaServicoService {
  constructor() {
    this.dentistaServicoRepository = new DentistaServicoRepository();
  }

  /**
   * Retorna todos os dentistas com seus serviços.
   * @returns {Array<Object>}
   */
  async getDentistasComServicos() {
    return await this.dentistaServicoRepository.findAllWithServices();
  }

  /**
   * Retorna os serviços de um dentista específico.
   * @param {number} dentistaId
   * @returns {Array<Object>}
   */
  async getServicosPorDentistaId(dentistaId) {
    if (!dentistaId) {
      throw new Error('O ID do dentista é obrigatório.');
    }

    return await this.dentistaServicoRepository.findServicesByDentistId(dentistaId);
  }
}

module.exports = DentistaServicoService;
