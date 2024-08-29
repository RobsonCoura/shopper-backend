import express from 'express';
import { setupSwagger } from './swagger';
import uploadRoutes from './routes/uploadRoutes';
import confirmRoutes from './routes/confirmRoutes';
import listRoutes from './routes/listRoutes';

const app = express();

app.use(express.json());

// Configurar rotas
app.use('/api', uploadRoutes);
app.use('/api', confirmRoutes);
app.use('/api', listRoutes);

// Configurar Swagger
setupSwagger(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
