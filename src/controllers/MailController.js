const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs'); 

const supabase = require('../config/supabaseClient');

require('dotenv').config();

module.exports = {
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      console.log("Email recebido:", email);

      
      const { data: usuarios, error } = await supabase
        .from('user') 
        .select('*')
        .eq('email', email)
        .limit(1);

      if (error || !usuarios || usuarios.length === 0) {
        return res.status(400).json({ message: 'Usuário não encontrado' });
      }

      const usuario = usuarios[0];

      
      const novaSenha = crypto.randomBytes(4).toString('hex');
      const hash = await bcrypt.hash(novaSenha, 10);

      
      const { error: updateError } = await supabase
        .from('user')
        .update({ senha: hash }) 
        .eq('id', usuario.id);

      if (updateError) throw updateError;

      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
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
