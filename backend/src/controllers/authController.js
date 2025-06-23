const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2m' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // CORREGIDO: usamos `role` en lugar de `rol`
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // res.cookie('authToken', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 15 * 60 * 1000,
    //   ...(process.env.NODE_ENV === 'production' ? { domain: 'tudominio.com' } : {})
    //   // domain: process.env.COOKIE_DOMAIN || 'localhost'
    // });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false, // true si usás HTTPS
      sameSite: 'lax', // o 'none' si estás usando HTTPS
      maxAge: 15 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
//ruta Protgida
exports.perfil = async (req, res) => {
  try {
    console.log("ok")
    // Verificar primero que req.user existe
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        error: 'No se pudo identificar al usuario'
      });
    }

    // Buscar usuario y transformar resultado
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado. La cuenta pudo haber sido eliminada.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Convertir a objeto limpio (usando el transform del Schema)
    const userObject = user.toObject();

    // Asegurar el formato de la respuesta
    const response = {
      status: 'success',
      data: {
        user: {
          id: userObject._id,
          email: userObject.email,
          role: userObject.role,
          name: userObject.name || '',
          avatar: userObject.avatar || '',
          createdAt: userObject.createdAt || new Date()
        }
      }
    };

    // Enviar respuesta con cabeceras adecuadas
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(response);

  } catch (error) {
    console.error('Error en perfil:', error);

    const response = {
      status: 'error',
      error: {
        message: 'Error interno al cargar el perfil',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    };

    res.status(500).json(response);
  }
};