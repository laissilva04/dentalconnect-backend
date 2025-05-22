const ConsultationRepository = require('../repositories/ConsultationRepository')


class ConsultationService {
  constructor() {
    this.consultationRepository = new ConsultationRepository();
  }

  /**
   * Retorna todos as consultas cadastrados.
   * @returns {Array<Consultation>}
   */
  async listConsultation() {
    return await this.consultationRepository.getAllConsultation();
  }

  /**
   * Busca consultas por paciente.
   * @param {number} pacienteId
   * @returns {Array<Consultation>}
   */
  async findConsultationsByPaciente(pacienteId) {
    if (!pacienteId) {
      throw new Error('O ID do paciente é obrigatório.');
    }
    return await this.consultationRepository.findByPaciente(pacienteId);
  }

  /**
   * Cria uma nova consulta.
   * @param {Object} consultation
   */
  async createConsultation(consultation) {
    const { data, horario, paciente, dentista, local, status, servico } = consultation;

    // Validação dos dados
    if (!data || !horario || !paciente || !dentista || !local || !status || !servico) {
      throw new Error('Todos os campos são obrigatórios.');
    }

    // Envia os dados validados para o repositório
    return await this.consultationRepository.createConsultation({ data, horario, paciente, dentista, local, status, servico });
  }

  /**
   * Atualiza uma consulta existente.
   * @param {number} id
   * @param {Object} updates
   */
  async updateConsultation(id, updates) {
    if (!id) {
      throw new Error('O ID da consulta é obrigatório.');
    }

    // Validação dos dados
    const { data, horario, paciente, dentista, local, status, servico } = updates;
    if (!data || !horario || !paciente || !dentista || !local || !status ||!servico) {
      throw new Error('Pelo menos um campo deve ser fornecido para atualização.');
    }

    return await this.consultationRepository.updateConsultation(id, updates);
  }

  /**
   * Deleta uma consulta.
   * @param {number} id
   */
  async deleteConsultation(id) {
    if (!id) {
      throw new Error('O ID da consulta é obrigatório.');
    }

    return await this.consultationRepository.deleteConsultation(id);
  }

   /**
   * Busca uma consulta pelo ID.
   * @param {number} id
   * @returns {Object|null}
   */
   async findConsultaById(id) {
    if (!id) {
      throw new Error('O ID da consulta é obrigatório.');
    }

    return await this.consultationRepository.findById(id);
  }
}

module.exports = ConsultationService;