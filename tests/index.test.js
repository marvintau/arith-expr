const parse = require('../dist');
 
test('simple arithmetic', () => {
  expect(parse('1+1')).toBe(2);
  expect(parse('3*(5+2)')).toBe(21);
  expect(parse('3*(5+2.5)')).toBe(22.5);
});

test('with variable table', () => {
  expect(parse('1+a', {a: 1})).toBe(2);
  expect(parse('3+b/c', {b:4, c:2})).toBe(5);
})

test('error', () => {
  expect(() => parse('<')).toThrowError('Expected');
  expect(() => parse('asdbsd')).toThrowError('identifier');
})
