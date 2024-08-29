import { Router } from 'express';
import { processImage } from '../services/geminiService';

const router = Router();

//Função: Receber imagem base64, validar, chamar API do Google Gemini, retornar o resultado.
router.post('/', async (req, res) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  // Validações básicas
  if (!image || !customer_code || !measure_datetime || !measure_type) {
    return res.status(400).json({ error_code: "INVALID_DATA", error_description: "Parâmetros inválidos" });
  }

  try {
    const result = await processImage(image, customer_code, measure_datetime, measure_type);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error_code: "INTERNAL_ERROR", error_description: "Erro ao processar imagem" });
  }
});

// Função: Confirmar ou corrigir valores lidos pelo LLM.
router.patch('/', (req, res) => {
  const { measure_uuid, confirmed_value } = req.body;

  if (!measure_uuid || typeof confirmed_value !== 'number') {
    return res.status(400).json({ error_code: "INVALID_DATA", error_description: "Parâmetros inválidos" });
  }

  // Lógica de confirmação e salvamento no banco de dados

  res.status(200).json({ success: true });
});

// Função: Listar as medidas realizadas para um cliente específico.
router.get('/', (req, res) => {
  const { customer_code } = req.params;
  const { measure_type } = req.query;

  // Validações de tipo e listagem das medidas

  res.status(200).json({
    customer_code,
    measures: [
      // Medidas retornadas do banco de dados
    ]
  });
});

export default router;
