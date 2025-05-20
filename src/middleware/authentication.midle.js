const jwt = require('jsonwebtoken')
const authentication = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expirado.' });
        }
        return res.status(401).json({ message: 'Token inválido.' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

module.exports = authentication;