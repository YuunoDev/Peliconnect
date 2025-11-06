const { calcularSuma } = require('../index');

describe('calcularSuma', () => {
  test('suma dos números válidos', () => {
    expect(calcularSuma(5, 3)).toBe(8);
    expect(calcularSuma('2', '4')).toBe(6);
  });

//   test('lanza error si alguno no es número', () => {
//     expect(() => calcularSuma('a', 3)).toThrow('Parámetros no son números válidos');
//     expect(() => calcularSuma(1, undefined)).toThrow('Parámetros no son números válidos');
//   });
});