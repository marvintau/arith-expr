const parse = require('../dist');
 
test('parsing simple arithmetic', () => {
  expect(parse('1+1')).toBe(2);
  expect(parse('3*(5+2)')).toBe(21);
  expect(parse('3*(5+2.5)')).toBe(22.5);
});

test('parsing expression with variable table', () => {
  expect(parse('1+a', {a: 1})).toBe(2);
  expect(parse('3+b/c', {b:4, c:2})).toBe(5);
})

test('中文支持', () => {
  expect(parse('1+借方-贷方', {借方: 20, 贷方:10})).toBe(11);
})

test('throwing error', () => {
  expect(() => parse('<')).toThrowError('Expected');
  expect(() => parse('asdbsd')).toThrowError('identifier');
})
