const LocalRepository = require('../repositories/LocalRepository');

class LocalService {
  constructor() {
    this.localRepository = new LocalRepository();
  }

  /**
   * Retorna todos os locais cadastrados.
   * @returns {Array<Local>}
   */
  async listLocais() {
    return await this.localRepository.getAllLocais();
  }

  /**
   * Cria um novo local.
   * @param {Object} local
   */
  async createLocal(local) {
    const { nome, endereco, numero, cidade, estado } = local;

    // Validação dos dados
    if (!nome || !endereco || !numero || !cidade || !estado) {
      throw new Error('Todos os campos são obrigatórios.');
    }

    // Envia os dados validados para o repositório
    return await this.localRepository.createLocal({ nome, endereco, numero, cidade, estado });
  }

  /**
   * Atualiza um local existente.
   * @param {number} id
   * @param {Object} updates
   */
  async updateLocal(id, updates) {
    if (!id) {
      throw new Error('O ID do local é obrigatório.');
    }

    // Validação dos dados (opcional, dependendo das regras de negócio)
    const { nome, endereco, numero, cidade, estado } = updates;
    if (!nome && !endereco && !numero && !cidade && !estado) {
      throw new Error('Pelo menos um campo deve ser fornecido para atualização.');
    }

    return await this.localRepository.updateLocal(id, updates);
  }

  /**
   * Deleta um local.
   * @param {number} id
   */
  async deleteLocal(id) {
    if (!id) {
      throw new Error('O ID do local é obrigatório.');
    }

    return await this.localRepository.deleteLocal(id);
  }

  /**
   * Busca um local pelo ID.
   * @param {number} id
   * @returns {Object|null}
   */
  async findLocalById(id) {
    if (!id) {
      throw new Error('O ID do local é obrigatório.');
    }

    return await this.localRepository.findById(id);
  }
}

module.exports = LocalService;