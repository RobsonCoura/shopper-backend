import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import uploadRoutes from '../routes/uploadRoutes';
import { processImage } from '../services/geminiService';
import { saveMeasure } from '../repositories/measureRepository';

jest.mock('../services/geminiService');
jest.mock('../repositories/measureRepository');

const app = express();
app.use(bodyParser.json());
app.use('/api', uploadRoutes);

const mockedProcessImage = processImage as jest.MockedFunction<typeof processImage>;
const mockedSaveMeasure = saveMeasure as jest.MockedFunction<typeof saveMeasure>;

describe('POST /upload', () => {
  it('should successfully process and save a measure', async () => {
    const mockResponse = {
      measure_uuid: '1234',
      measure_value: 50,
      image_url: 'http://example.com/image.jpg'
    };
    mockedProcessImage.mockResolvedValue(mockResponse);
    mockedSaveMeasure.mockResolvedValue({
      ...mockResponse,
      customer_code: 'customer1',
      measure_datetime: new Date(),
      measure_type: 'WATER',
      has_confirmed: false
    });

    const response = await request(app)
      .post('/api/upload')
      .send({
        image: 'base64image',
        customer_code: 'customer1',
        measure_datetime: new Date().toISOString(),
        measure_type: 'WATER'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      image_url: 'http://example.com/image.jpg',
      measure_value: 50,
      measure_uuid: '1234'
    });
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/api/upload')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error_code: 'INVALID_DATA',
      error_description: 'Todos os campos são obrigatórios.'
    });
  });

  it('should return 409 if measure already exists', async () => {
    mockedProcessImage.mockResolvedValue({
      measure_uuid: '1234',
      measure_value: 50,
      image_url: 'http://example.com/image.jpg'
    });
    mockedSaveMeasure.mockImplementation(() => {
      throw new Error('Leitura do mês já realizada');
    });

    const response = await request(app)
      .post('/api/upload')
      .send({
        image: 'base64image',
        customer_code: 'customer1',
        measure_datetime: new Date().toISOString(),
        measure_type: 'WATER'
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      error_code: 'DOUBLE_REPORT',
      error_description: 'Leitura do mês já realizada'
    });
  });
});
