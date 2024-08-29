import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * /{customer_code}/list:
 *   get:
 *     summary: Lista as medidas realizadas por um cliente
 *     parameters:
 *       - in: path
 *         name: customer_code
 *         required: true
 *         schema:
 *           type: string
 *         example: 'customer1'
 *       - in: query
 *         name: measure_type
 *         schema:
 *           type: string
 *           enum:
 *             - WATER
 *             - GAS
 *           example: 'WATER'
 *     responses:
 *       '200':
 *         description: Lista de medidas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer_code:
 *                   type: string
 *                   example: 'customer1'
 *                 measures:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       measure_uuid:
 *                         type: string
 *                         example: '1234'
 *                       measure_datetime:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-08-28T00:00:00Z'
 *                       measure_type:
 *                         type: string
 *                         example: 'WATER'
 *                       has_confirmed:
 *                         type: boolean
 *                         example: false
 *                       image_url:
 *                         type: string
 *                         example: 'http://example.com/image.jpg'
 *       '400':
 *         description: Tipo de medição inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error_code:
 *                   type: string
 *                   example: 'INVALID_TYPE'
 *                 error_description:
 *                   type: string
 *                   example: 'Tipo de medição não permitida'
 *       '404':
 *         description: Nenhuma medida encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error_code:
 *                   type: string
 *                   example: 'MEASURES_NOT_FOUND'
 *                 error_description:
 *                   type: string
 *                   example: 'Nenhuma leitura encontrada'
 */

router.get('/:customer_code/list', (req: Request, res: Response) => {
  const { customer_code } = req.params;
  const { measure_type } = req.query;

  // Aqui você deve adicionar a lógica para buscar medidas no banco de dados

  res.status(200).json({
    customer_code,
    measures: [
      // Array de medidas retornadas do banco de dados
    ],
  });
});

export default router;
