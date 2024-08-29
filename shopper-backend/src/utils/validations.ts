export const isValidBase64 = (str: string): boolean => {
    const base64Regex = /^(?:[A-Za-z0-9+\/=]{4})*$/;
    return base64Regex.test(str);
  };
  
  export const isValidMeasureType = (type: string): boolean => {
    return ['WATER', 'GAS'].includes(type.toUpperCase());
  };
  