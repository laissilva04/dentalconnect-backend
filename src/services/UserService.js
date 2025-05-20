const UserRepository = require('../repositories/UserRepository');
const md5 = require('md5');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async listUsers() {
    return await this.userRepository.getAllUsers();
  }

  async listUsersByType(tipo) {
    if (!tipo) {
      throw new Error('O tipo de usuário é obrigatório.');
    }
    return await this.userRepository.getUsersByType(tipo);
  }

  /**
   * Registra um novo usuário.
   * @param {Object} user
   */

  async registerUser(user) {
    const { nome, email, senha, data_nascimento, tipo, cpf, cidade, estado, cro} = user;
    console.log("Dados recebidos no serviço:", { nome, email, senha, data_nascimento, tipo, cpf, cidade, estado, cro });

    // Validação dos dados
    if (!nome || !email || !senha || !data_nascimento || !tipo || !cpf || !cidade || !estado) {
      throw new Error('Todos os campos são obrigatórios.');
    }

    if (!['paciente', 'dentista'].includes(tipo)) {
      throw new Error('Tipo de usuário inválido. Deve ser "paciente" ou "dentista".');
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Usuário já cadastrado com este e-mail.');
    }

    // Envia os dados validados
    return await this.userRepository.createUser({ nome, email, senha: md5(senha), data_nascimento, tipo, cpf, cidade, estado, cro});
  }

  async updateUser(id, updates) {
    if (!id) {
      throw new Error("O ID do usuário é obrigatório.");
    }
  
    if (updates.senha) {
      // Criptografar a senha antes de atualizar
      updates.senha = md5(updates.senha);
    }
  
    return await this.userRepository.updateUser(id, updates);
  }

  async deleteUser(id) {
    if (!id) {
      throw new Error("O ID do usuário é obrigatório.");
    }
  
    return await this.userRepository.deleteUser(id);
  }
  
  
}

module.exports = UserService;