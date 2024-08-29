import { Request, Response } from 'express';
import Measure from '../models/measureModel';

export const confirm = async (req: Request, res: Response) => {
  const { measure_uuid, confirmed_value } = req.body;

  if (!measure_uuid || typeof confirmed_value !== 'number') {
    return res.status(400).json({ error_code: "INVALID_DATA", error_description: "Parâmetros inválidos" });
  }

  try {
    const measure = await Measure.findOne({ measure_uuid });

    if (!measure) {
      return res.status(404).json({ error_code: "MEASURE_NOT_FOUND", error_description: "Leitura não encontrada" });
    }

    if (measure.has_confirmed) {
      return res.status(409).json({ error_code: "CONFIRMATION_DUPLICATE", error_description: "Leitura já confirmada" });
    }

    measure.measure_value = confirmed_value;
    measure.has_confirmed = true;
    await measure.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error_code: "INTERNAL_ERROR", error_description: "Erro ao confirmar leitura" });
  }
};
