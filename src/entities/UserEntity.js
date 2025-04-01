class User {
    constructor(id, nome, email, senha, data_nascimento, tipo, cpf, cidade, estado, cro) {
      this.id = id;
      this.nome = nome;
      this.email = email;
      this.senha = senha; 
      this.data_nascimento = data_nascimento;
      this.tipo = tipo;
      this.cpf = cpf;
      this.cidade = cidade;
      this.estado = estado;
      this.cro = cro;
    }
  }
  
  module.exports = User;
  