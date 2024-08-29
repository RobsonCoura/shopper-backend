import { Request, Response } from 'express';
import Measure from '../models/measureModel';

export const listMeasures = async (req: Request, res: Response) => {
  const { customer_code } = req.params;
  const { measure_type } = req.query;

  // Validação do tipo de medição
  if (measure_type && !['WATER', 'GAS'].includes(measure_type.toString().toUpperCase())) {
    return res.status(400).json({ error_code: "INVALID_TYPE", error_description: "Tipo de medição não permitida" });
  }

  try {
    const query = {
      customer_code,
      ...(measure_type && { measure_type: measure_type.toString().toUpperCase() })
    };

    const measures = await Measure.find(query);
    res.status(200).json(measures);
  } catch (error) {
    res.status(500).json({ error_code: "INTERNAL_ERROR", error_description: "Erro ao listar medições" });
  }
};
