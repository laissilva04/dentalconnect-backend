const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');


let usuarios = [
  {
    id: 1,
    email: 'leticialucena.021@gmail.com', 
    senha: '123456'
  }
];

module.exports = {
  forgotPassword: async (req, res) => {
    try {
      
      const { email } = req.body;

     
      console.log("Email recebido no body:", email);

      
      const usuario = usuarios.find(u => u.email === email);
      if (!usuario) {
        return res.status(400).json({ message: 'Usuário não encontrado' });
      }

      
      const novaSenha = crypto.randomBytes(4).toString('hex');

      
      const hash = await bcrypt.hash(novaSenha, 10);

      
      usuario.senha = hash;

      
      
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'leticialucena.021@gmail.com',     
          
          pass: 'ysdqjxmnybbqxini'
        }
      });

      
      let mailOptions = {
        from: 'leticialucena.021@gmail.com',   
        to: usuario.email,                     
        subject: 'Sua nova senha',
        text: `
          Olá!
          Sua senha foi redefinida. Segue abaixo a sua nova senha de acesso:
          
          Nova Senha: ${novaSenha}
          
          Use essa senha para fazer login. Depois, vá em "Alterar Senha" se quiser personalizá-la.
        `
      };

      
      await transporter.sendMail(mailOptions);

      
      return res.status(200).json({ message: 'Nova senha enviada por e-mail.' });

    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return res.status(500).json({ message: 'Erro ao processar solicitação' });
    }
  }
};
