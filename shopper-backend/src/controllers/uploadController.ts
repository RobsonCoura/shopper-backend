import { Request, Response } from 'express';
import { processImage } from '../services/geminiService';
import Measure from '../models/measureModel';
import { isValidBase64, isValidMeasureType } from '../utils/validations';

export const upload = async (req: Request, res: Response) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  // Validações
  if (!isValidBase64(image) || !customer_code || !measure_datetime || !isValidMeasureType(measure_type)) {
    return res.status(400).json({ error_code: "INVALID_DATA", error_description: "Parâmetros inválidos" });
  }

  try {
    // Verificação se já existe uma leitura no mês
    const existingMeasure = await Measure.findOne({
      customer_code,
      measure_type,
      measure_datetime: { $gte: new Date(new Date(measure_datetime).setDate(1)) }
    });

    if (existingMeasure) {
      return res.status(409).json({ error_code: "DOUBLE_REPORT", error_description: "Leitura do mês já realizada" });
    }

    const result = await processImage(image, customer_code, new Date(measure_datetime), measure_type);
    const newMeasure = new Measure({
      customer_code,
      measure_uuid: result.measure_uuid,
      measure_datetime: new Date(measure_datetime),
      measure_type,
      measure_value: result.measure_value,
      image_url: result.image_url
    });

    await newMeasure.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error_code: "INTERNAL_ERROR", error_description: "Erro ao processar imagem" });
  }
};
