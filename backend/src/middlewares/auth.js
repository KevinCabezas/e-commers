const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const token = req.cookies.authToken || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      error: 'Acceso no autorizado. Por favor inicie sesión.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId || !decoded.role) {
      throw new Error('Token inválido: estructura incorrecta');
    }

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Error en autenticación:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Sesión expirada. Por favor inicie sesión nuevamente.'
      });
    }

    res.status(401).json({
      error: 'Token inválido. Por favor inicie sesión.'
    });
  }
};
