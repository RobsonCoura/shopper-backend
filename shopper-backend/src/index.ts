import express from 'express';
import { setupSwagger } from './swagger';
import listRoutes from './routes/listRoutes';
import * as dotenv from 'dotenv';


dotenv.config();


const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configuração do Swagger
setupSwagger(app);

// Endpoint raiz para verificar se a API está funcionando
app.get('/api', (req, res) => {
  res.send('API is running');
});

// Usando rotas definidas em listRoutes
app.use('/api', listRoutes);

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



