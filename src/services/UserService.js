const UserRepository = require('../repositories/UserRepository');
const bcrypt = require('bcryptjs');

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

    // Criptografar a senha usando bcrypt
    const senhaHash = await bcrypt.hash(userData.senha, 12);

    // Criar objeto com os dados do usuário
    const newUser = {
      ...userData,
      senha: senhaHash, // Criptografar a senha com bcrypt
      avatar: null // Inicializar o avatar como null
    };

    console.log("Dados do usuário antes de salvar:", { ...newUser, senha: '[HASHED]' });
    
    // Salvar no banco de dados
    const createdUser = await this.userRepository.createUser(newUser);
    console.log("Usuário criado:", createdUser);
    
    return createdUser;
  }

  async updateUser(id, userData) {
    // Se houver senha, criptografar com bcrypt
    if (userData.senha) {
      userData.senha = await bcrypt.hash(userData.senha, 12);
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