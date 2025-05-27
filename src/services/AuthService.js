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

        console.log("Buscando usuário com email:", email);
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            console.log("Usuário não encontrado");
            throw new Error('Credenciais inválidas.');
        }

        console.log("Usuário encontrado:", {
            id: user.id,
            nome: user.nome,
            email: user.email,
            avatar: user.avatar,
            tipo: user.tipo,
            senhaHash: user.senha,
            senhaFornecidaHash: md5(senha)
        });
  
        if(user.senha !== md5(senha)) {
            console.log("Senha incorreta");
            throw new Error('Credenciais inválidas.');
        }

        // Garantir que o ID seja uma string
        const userId = String(user.id);

        // Gerar um token JWT com o ID do usuário
        const tokenPayload = { userId };
        console.log('Payload do token:', tokenPayload);
        
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token gerado:', token);

        // Garantir que o avatar seja uma string ou null
        const userAvatar = user.avatar || null;

        const response = {
            token,
            user: {
                id: userId,
                nome: user.nome,
                email: user.email,
                avatar: userAvatar,
                tipo: user.tipo
            },
            tipo: user.tipo,
            nome: user.nome,
            email: user.email
        };

        console.log("Resposta do login:", response);
        return response;
    }
}

module.exports = AuthService