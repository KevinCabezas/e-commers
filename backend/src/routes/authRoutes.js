const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const rateLimit = require('express-rate-limit');

// Limitador de tasa para login/registro
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // Límite de intentos
  message: 'Demasiados intentos. Por favor espere 15 minutos.'
});

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);

// Rutas protegidas
router.get('/perfil', authenticate, authController.perfil);

module.exports = router;