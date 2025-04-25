const UserRepository = require('../repositories/UserRepository')
const jwt = require('jsonwebtoken')
const md5 = require('md5')

class AuthService{

    constructor() {
        this.userRepository = new UserRepository;
    }

    async loginUser(userData) {
        const { email, senha } = userData;

        if (!email || !senha) {
            throw new Error('Email e senha são obrigatórios.');
        }

        const user = await this.userRepository.findByEmail(email);

        console.log("Avatar do usuário:", user.avatar);

        if (!user) {
            throw new Error('Credenciais inválidas.');
        }
  
        if(user.senha !== md5(senha)) {
            throw new Error('Credenciais inválidas.');
        }

        // Gerar um token JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return {
            token,
	        user: user.id,
	        tipo: user.tipo,
            nome: user.nome,
            avatar: user.avatar
        }
    }

}

module.exports = AuthService