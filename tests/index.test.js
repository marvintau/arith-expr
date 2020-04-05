const {add, get, pathify, flat} = require('@marvintau/chua');
const parse = require('../dist');
 
Array.prototype.randomChoice = function(){
  return this[Math.floor(Math.random() * this.length)];
}

const bigArray = [];

const getRandomChildren = (array) => {
  if (Math.random() > 0.5 || array.length === 0){
    return array;
  } else {

    let list = array, rec;

    while (list !== undefined && list.length > 0){
      rec = list.randomChoice();
      if (Math.random() > 0.5 || rec == undefined){
        break;
      } else {
        list = rec.__children;
      }
    }
    if (rec.__children === undefined){
      rec.__children = [];
    }
    return rec.__children;  
  }
}

for (let i = 0; i < 5000; i++){
  const children = getRandomChildren(bigArray) ;
  add(children, {num: Math.random() * 1000, name:'S' + Math.random().toString(31).slice(2, -4).toUpperCase()});
}
pathify(bigArray);
const flattened = flat(bigArray);
const paths = flattened.map(({__path}) => __path);


test('parsing simple arithmetic', () => {
  expect(parse('-5')).toBe(-5);
  expect(parse('-5.123')).toBe(-5.123);
  expect(parse('1+1')).toBe(2);
  expect(parse('3*(5+2)')).toBe(21);
  expect(parse('3*(5+2.5)')).toBe(22.5);
  expect(parse('(-3)*(5-2.5)')).toBe(-7.5);
});

test('parsing expression with variable table', () => {
  expect(parse('1 + $a', {a: 1})).toBe(2);
  expect(parse('-$a', {a: 1})).toBe(-1);
  expect(parse('3+ $b / $c', {b:4, c:2})).toBe(5);
})

test('中文支持', () => {
  expect(parse('1+$借方-$贷方', {借方: 20, 贷方:10})).toBe(11);
})

test('throwing error', () => {
  // expect(() => parse('-5')).toThrow();
  // expect(() => parse('')).toThrow();
  expect(() => parse('<')).toThrowError('Expected');
  expect(() => parse('$asdbsd')).toThrowError('Identifier');
})

test('comparison', () => {
  expect(parse('$a === $b', {a:1, b:2})).toBe(1);
  expect(parse('$a === $b', {a:1, b:1})).toBe('EQUAL');
})

test('path', () => {
  const path = paths.randomChoice();
  const {list} = get(bigArray, {path, withList:true});
  const pathName = list.map(({name}) => name);
  const {record, siblings} = get(bigArray, {path: pathName, column:'name'});

  const pathString = pathName.join('/');
  const nonExistPathString = pathString.slice(0, -3);

  const foundPathResult = parse(`ARRAY:${pathString}:$num`, {}, {ARRAY:bigArray}, 'name');
  const notFoundPathResult = parse(`ARRAY:${nonExistPathString}`, {}, {ARRAY:bigArray}, 'name');
  expect(foundPathResult.result).toBe(record.num);
  expect(foundPathResult.siblings.length).toBe(siblings.length);
  expect(notFoundPathResult.result).toBe(undefined);
  expect(notFoundPathResult.siblings).toEqual(siblings);
  expect(() => parse(`YO:${pathName.join('/')}:1`, {__column:'name'}, {ARRAY:bigArray})).toThrowError('Sheet name');
})