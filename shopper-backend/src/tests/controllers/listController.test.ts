import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import listRoutes from '../routes/listRoutes';
import { findMeasureByCustomerAndDate } from '../repositories/measureRepository';

jest.mock('../repositories/measureRepository');

const app = express();
app.use(bodyParser.json());
app.use('/api', listRoutes);

const mockedFindMeasureByCustomerAndDate = findMeasureByCustomerAndDate as jest.MockedFunction<typeof findMeasureByCustomerAndDate>;

describe('GET /:customer_code/list', () => {
  it('should return measures for a customer', async () => {
    mockedFindMeasureByCustomerAndDate.mockResolvedValue([
      {
        measure_uuid: '1234',
        customer_code: 'customer1',
        measure_datetime: new Date(),
        measure_type: 'WATER',
        measure_value: 50,
        image_url: 'http://example.com/image.jpg',
        has_confirmed: false
      }
    ]);

    const response = await request(app)
      .get('/api/customer1/list')
      .query({ measure_type: 'WATER' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      customer_code: 'customer1',
      measures: [
        {
          measure_uuid: '1234',
          measure_datetime: expect.any(String),
          measure_type: 'WATER',
          has_confirmed: false,
          image_url: 'http://example.com/image.jpg'
        }
      ]
    });
  });

  it('should return 400 if measure_type is invalid', async () => {
    const response = await request(app)
      .get('/api/customer1/list')
      .query({ measure_type: 'INVALID' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error_code: 'INVALID_TYPE',
      error_description: 'Tipo de medição não permitida'
    });
  });

  it('should return 404 if no measures found', async () => {
    mockedFindMeasureByCustomerAndDate.mockResolvedValue([]);

    const response = await request(app)
      .get('/api/customer1/list');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error_code: 'MEASURES_NOT_FOUND',
      error_description: 'Nenhuma leitura encontrada'
    });
  });
});
