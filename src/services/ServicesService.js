const ServicesRepository = require('../repositories/ServicesRepository');

class ServicesService {
  constructor() {
    this.servicesRepository = new ServicesRepository();
  }

  /**
   * Retorna todos os serviços cadastrados.
   * @returns {Array<Service>}
   */
  async listServices() {
    return await this.servicesRepository.getAll();
  }

  /**
   * Cria um novo serviço.
   * @param {Object} service - { nome, descricao }
   */
  async createService(service) {
    const { nome, descricao } = service;

    // Validação dos dados
    if (!nome || !descricao) {
      throw new Error('Nome e descrição são obrigatórios.');
    }

    // Envia os dados validados para o repositório
    return await this.servicesRepository.create({ nome, descricao });
  }

  /**
   * Atualiza um serviço existente.
   * @param {number} id
   * @param {Object} updates - { nome, descricao }
   */
  async updateService(id, updates) {
    if (!id) {
      throw new Error('O ID do serviço é obrigatório.');
    }

    // Validação dos dados
    const { nome, descricao } = updates;
    if (!nome && !descricao) {
      throw new Error('Pelo menos um campo (nome ou descrição) deve ser fornecido para atualização.');
    }

    return await this.servicesRepository.update(id, updates);
  }

  /**
   * Deleta um serviço.
   * @param {number} id
   */
  async deleteService(id) {
    if (!id) {
      throw new Error('O ID do serviço é obrigatório.');
    }

    return await this.servicesRepository.delete(id);
  }

  /**
   * Busca um serviço pelo ID.
   * @param {number} id
   * @returns {Object|null}
   */
  async findServiceById(id) {
    if (!id) {
      throw new Error('O ID do serviço é obrigatório.');
    }

    return await this.servicesRepository.findById(id);
  }

  /**
   * Busca serviços por nome (busca parcial).
   * @param {string} nome
   * @returns {Array<Object>}
   */
  async searchServicesByName(nome) {
    if (!nome || nome.trim() === '') {
      throw new Error('O termo de busca é obrigatório.');
    }

    return await this.servicesRepository.searchByName(nome);
  }
}

module.exports = ServicesService;