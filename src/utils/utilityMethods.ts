export const isAlphaNumeric = (char: string): boolean => /[\d\w]/.test(char);
export const isWhiteSpace = (char: string): boolean => /\s/.test(char);

export const isBooleanTrue = (value: string): boolean => value === 'true';
export const isBooleanFalse = (value: string): boolean => value === 'false';
export const isNull = (value: string): boolean => value === 'null';
export const isNumber = (value: string): boolean => !isNaN(Number(value));
