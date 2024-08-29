import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /confirm:
 *   patch:
 *     summary: Confirma ou corrige o valor lido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               measure_uuid:
 *                 type: string
 *                 example: '1234'
 *               confirmed_value:
 *                 type: integer
 *                 example: 55
 *     responses:
 *       '200':
 *         description: Medida confirmada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       '400':
 *         description: Dados fornecidos são inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error_code:
 *                   type: string
 *                   example: 'INVALID_DATA'
 *                 error_description:
 *                   type: string
 *                   example: 'Dados inválidos.'
 *       '404':
 *         description: Leitura não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error_code:
 *                   type: string
 *                   example: 'MEASURE_NOT_FOUND'
 *                 error_description:
 *                   type: string
 *                   example: 'Leitura não encontrada.'
 *       '409':
 *         description: Leitura já confirmada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error_code:
 *                   type: string
 *                   example: 'CONFIRMATION_DUPLICATE'
 *                 error_description:
 *                   type: string
 *                   example: 'Leitura já confirmada.'
 */

router.patch('/', (req, res) => {
  const { measure_uuid, confirmed_value } = req.body;

  if (!measure_uuid || typeof confirmed_value !== 'number') {
    return res.status(400).json({ error_code: "INVALID_DATA", error_description: "Parâmetros inválidos" });
  }

  // Lógica de confirmação e salvamento no banco de dados

  res.status(200).json({ success: true });
});

export default router;
