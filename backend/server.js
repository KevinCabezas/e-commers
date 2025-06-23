require('./db'); // Conecta a MongoDB
require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cookieParser());

const corsOptions = {
  origin: [
    'http://localhost:5000',
    'http://127.0.0.1:5500', // Reemplaza con tu URL frontend
    'https://6859b1400f40520008412a54--startling-squirrel-7332d4.netlify.app/'
  ],
  credentials: true, // Permite cookies
  exposedHeaders: ['set-cookie']
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', require('./src/routes/authRoutes'));

app.get('/', (req, res) => {
  res.send('API conectada a MongoDB');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
