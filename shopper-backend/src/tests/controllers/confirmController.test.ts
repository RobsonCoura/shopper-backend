import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import confirmRoutes from '../routes/confirmRoutes';
import { findMeasureByCustomerAndDate, saveMeasure } from '../repositories/measureRepository';

jest.mock('../repositories/measureRepository');

const app = express();
app.use(bodyParser.json());
app.use('/api', confirmRoutes);

const mockedFindMeasureByCustomerAndDate = findMeasureByCustomerAndDate as jest.MockedFunction<typeof findMeasureByCustomerAndDate>;
const mockedSaveMeasure = saveMeasure as jest.MockedFunction<typeof saveMeasure>;

describe('PATCH /confirm', () => {
  it('should successfully confirm a measure', async () => {
    mockedFindMeasureByCustomerAndDate.mockResolvedValue({
      measure_uuid: '1234',
      has_confirmed: false
    });
    mockedSaveMeasure.mockResolvedValue({
      measure_uuid: '1234',
      customer_code: 'customer1',
      measure_datetime: new Date(),
      measure_type: 'WATER',
      measure_value: 50,
      image_url: 'http://example.com/image.jpg',
      has_confirmed: true
    });

    const response = await request(app)
      .patch('/api/confirm')
      .send({
        measure_uuid: '1234',
        confirmed_value: 55
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  it('should return 400 if data is invalid', async () => {
    const response = await request(app)
      .patch('/api/confirm')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error_code: 'INVALID_DATA',
      error_description: 'Dados inválidos.'
    });
  });

  it('should return 404 if measure not found', async () => {
    mockedFindMeasureByCustomerAndDate.mockResolvedValue(null);

    const response = await request(app)
      .patch('/api/confirm')
      .send({
        measure_uuid: '1234',
        confirmed_value: 55
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error_code: 'MEASURE_NOT_FOUND',
      error_description: 'Leitura não encontrada.'
    });
  });

  it('should return 409 if measure already confirmed', async () => {
    mockedFindMeasureByCustomerAndDate.mockResolvedValue({
      measure_uuid: '1234',
      has_confirmed: true
    });

    const response = await request(app)
      .patch('/api/confirm')
      .send({
        measure_uuid: '1234',
        confirmed_value: 55
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      error_code: 'CONFIRMATION_DUPLICATE',
      error_description: 'Leitura já confirmada.'
    });
  });
});
