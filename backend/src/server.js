require('dotenv').config();
const express = require('express');
const cors = require('cors');

const initDb = require('./config/initDb');

const authRoutes = require('./routes/authRoutes');
const medicoRoutes = require('./routes/medicoRoutes');
const plantaoRoutes = require('./routes/plantaoRoutes');
const candidaturaRoutes = require('./routes/candidaturaRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({
    mensagem: 'API do PlantãoMed funcionando'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/plantoes', plantaoRoutes);
app.use('/api/candidaturas', candidaturaRoutes);
app.use('/api/relatorios', relatorioRoutes);

app.use((req, res) => {
  return res.status(404).json({
    erro: 'Rota não encontrada'
  });
});

app.listen(PORT, async () => {
  await initDb();
  console.log(
    `Servidor executando em http://localhost:${PORT}`
  );
});