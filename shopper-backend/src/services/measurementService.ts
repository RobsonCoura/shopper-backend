import Measure from '../models/measureModel';
import { processImage } from '../services/geminiService';

export const createMeasure = async (image: string, customer_code: string, measure_datetime: Date, measure_type: 'WATER' | 'GAS') => {
  // Verificar se já existe uma leitura para o mês atual
  const existingMeasure = await Measure.findOne({
    customer_code,
    measure_type,
    measure_datetime: {
      $gte: new Date(measure_datetime.getFullYear(), measure_datetime.getMonth(), 1),
      $lt: new Date(measure_datetime.getFullYear(), measure_datetime.getMonth() + 1, 1)
    }
  });

  if (existingMeasure) {
    throw new Error('Leitura do mês já realizada');
  }

  // Processar imagem usando o serviço do Gemini
  const result = await processImage(image, customer_code, measure_datetime, measure_type);

  // Salvar a nova medida no banco de dados
  const measure = new Measure({
    measure_uuid: result.measure_uuid,
    customer_code,
    measure_datetime,
    measure_type,
    measure_value: result.measure_value,
    image_url: result.image_url,
    has_confirmed: false
  });

  await measure.save();

  return measure;
};
