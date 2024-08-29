import axios from 'axios';

export const processImage = async (image: string, customer_code: string, measure_datetime: Date, measure_type: 'WATER' | 'GAS') => {
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await axios.post('https://ai.google.dev/gemini-api/vision', {
    image,
    customer_code,
    measure_datetime,
    measure_type
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });

  return response.data;
};

