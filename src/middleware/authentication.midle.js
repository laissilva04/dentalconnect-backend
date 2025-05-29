const jwt = require('jsonwebtoken')
const authentication = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split('Bearer ')[1];
    console.log('Token recebido:', token);

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Erro ao verificar token:', err);
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expirado.' });
        }
        return res.status(401).json({ message: 'Token inválido.' });
      }

      console.log('Token decodificado:', decoded);
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

module.exports = authentication;