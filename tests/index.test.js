const parse = require('../dist');
 
test('parsing simple arithmetic', () => {
  expect(parse('-5')).toBe(-5);
  expect(parse('-5.123')).toBe(-5.123);
  expect(parse('1+1')).toBe(2);
  expect(parse('3*(5+2)')).toBe(21);
  expect(parse('3*(5+2.5)')).toBe(22.5);
  expect(parse('(-3)*(5-2.5)')).toBe(-7.5);
});

test('parsing expression with variable table', () => {
  expect(parse('1+a', {a: 1})).toBe(2);
  expect(parse('-a', {a: 1})).toBe(-1);
  expect(parse('3+b/c', {b:4, c:2})).toBe(5);
})

test('中文支持', () => {
  expect(parse('1+借方-贷方', {借方: 20, 贷方:10})).toBe(11);
})

test('throwing error', () => {
  // expect(() => parse('-5')).toThrow();
  // expect(() => parse('')).toThrow();
  expect(() => parse('<')).toThrowError('Expected');
  expect(() => parse('asdbsd')).toThrowError('identifier');
})

test('comparison', () => {
  expect(parse('a === b', {a:1, b:2})).toBe(1);
  expect(parse('a === b', {a:1, b:1})).toBe('EQUAL');
})