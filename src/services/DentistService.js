const DentistRepository = require('../repositories/DentistRepository');

class DentistService {
  constructor() {
    this.dentistRepository = new DentistRepository();
  }

  /**
   * Retorna todos os dentistas cadastrados.
   * @returns {Array<Dentist>}
   */
  async listDentists() {
    return await this.dentistRepository.getAllDentists();
  }

  /**
   * Cria um novo dentista.
   * @param {Object} dentistData
   */
  async createDentist(dentistData) {
    const { id_usuario, numero_cro } = dentistData;

    // Validação dos dados
    if (!id_usuario || !numero_cro) {
      throw new Error('ID do usuário e número do CRO são obrigatórios.');
    }

    // Verifica se já existe um dentista com este CRO
    const existingDentist = await this.dentistRepository.findByCroNumber(numero_cro);
    if (existingDentist) {
      throw new Error('Já existe um dentista cadastrado com este número de CRO.');
    }

    // Verifica se o usuário já está vinculado a outro dentista
    const userDentist = await this.dentistRepository.findByUserId(id_usuario);
    if (userDentist) {
      throw new Error('Este usuário já está vinculado a outro dentista.');
    }

    // Envia os dados validados para o repositório
    return await this.dentistRepository.createDentist({
      id_usuario,
      numero_cro,
      created_at: new Date().toISOString()
    });
  }

  /**
   * Atualiza um dentista existente.
   * @param {number} id
   * @param {Object} updates
   */
  async updateDentist(id, updates) {
    if (!id) {
      throw new Error('O ID do dentista é obrigatório.');
    }

    // Validação dos dados
    const { numero_cro } = updates;
    if (numero_cro) {
      const existingDentist = await this.dentistRepository.findByCroNumber(numero_cro);
      if (existingDentist && existingDentist.id !== id) {
        throw new Error('Já existe outro dentista com este número de CRO.');
      }
    }

    return await this.dentistRepository.updateDentist(id, updates);
  }

  /**
   * Deleta um dentista.
   * @param {number} id
   */
  async deleteDentist(id) {
    if (!id) {
      throw new Error('O ID do dentista é obrigatório.');
    }

    return await this.dentistRepository.deleteDentist(id);
  }

  /**
   * Busca um dentista pelo ID.
   * @param {number} id
   * @returns {Object|null}
   */
  async findDentistById(id) {
    if (!id) {
      throw new Error('O ID do dentista é obrigatório.');
    }

    return await this.dentistRepository.findByUserId(id); // Ou implementar findById no repository se necessário
  }

  /**
   * Busca um dentista pelo ID do usuário vinculado
   * @param {number} id_usuario
   * @returns {Object|null}
   */
  async findDentistByUserId(id_usuario) {
    if (!id_usuario) {
      throw new Error('O ID do usuário é obrigatório.');
    }

    return await this.dentistRepository.findByUserId(id_usuario);
  }

  /**
   * Busca um dentista pelo número do CRO
   * @param {string} numero_cro
   * @returns {Object|null}
   */
  async findDentistByCro(numero_cro) {
    if (!numero_cro) {
      throw new Error('O número do CRO é obrigatório.');
    }

    return await this.dentistRepository.findByCroNumber(numero_cro);
  }
}

module.exports = DentistService;