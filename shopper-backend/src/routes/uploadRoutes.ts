import { Router } from 'express';
import { upload } from '../controllers/uploadController';

const router = Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Recebe uma imagem e retorna a medida lida
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 example: 'base64string'
 *               customer_code:
 *                 type: string
 *                 example: 'customer1'
 *               measure_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-08-28T00:00:00Z'
 *               measure_type:
 *                 type: string
 *                 enum:
 *                   - WATER
 *                   - GAS
 *                 example: 'WATER'
 *     responses:
 *       '200':
 *         description: Medida processada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 image_url:
 *                   type: string
 *                   example: 'http://example.com/image.jpg'
 *                 measure_value:
 *                   type: integer
 *                   example: 50
 *                 measure_uuid:
 *                   type: string
 *                   example: '1234'
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
 *                   example: 'Todos os campos são obrigatórios.'
 *       '409':
 *         description: Leitura já realizada para este tipo no mês atual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error_code:
 *                   type: string
 *                   example: 'DOUBLE_REPORT'
 *                 error_description:
 *                   type: string
 *                   example: 'Leitura do mês já realizada'
 */

router.post('/upload', upload);

export default router;
