import app from './app';
import './config/database';  // Importar configuração do banco de dados

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
