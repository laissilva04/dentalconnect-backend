class User {
    constructor(id, nome, email, senha, data_nascimento, tipo) {
      this.id = id;
      this.nome = nome;
      this.email = email;
      this.senha = senha; 
      this.data_nascimento = data_nascimento;
      this.tipo = tipo;
    }
  }
  
  module.exports = User;
  