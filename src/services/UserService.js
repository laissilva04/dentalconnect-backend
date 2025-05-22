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
    return await this.userRepository.getUsersByType(tipo);
  }

  /**
   * Registra um novo usuário.
   * @param {Object} userData
   */

  async registerUser(userData) {
    console.log("Dados recebidos no serviço:", userData);
    
    // Verificar se o email já está em uso
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // Criar objeto com os dados do usuário
    const newUser = {
      ...userData,
      senha: md5(userData.senha), // Criptografar a senha
      avatar: null // Inicializar o avatar como null
    };

    console.log("Dados do usuário antes de salvar:", newUser);
    
    // Salvar no banco de dados
    const createdUser = await this.userRepository.createUser(newUser);
    console.log("Usuário criado:", createdUser);
    
    return createdUser;
  }

  async updateUser(id, userData) {
    // Se houver senha, criptografar
    if (userData.senha) {
      userData.senha = md5(userData.senha);
    }
    return await this.userRepository.updateUser(id, userData);
  }

  async deleteUser(id) {
    return await this.userRepository.deleteUser(id);
  }

  async findById(id) {
    return await this.userRepository.findById(id);
  }
}

module.exports = UserService;