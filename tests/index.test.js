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

describe('evaluating expr', () => {
  test('parsing simple arithmetic', () => {
    expect(parse('-5').result).toBe(-5);
    expect(parse('-5.123').result).toBe(-5.123);
    expect(parse('1+1').result).toBe(2);
    expect(parse('3*(5+2)').result).toBe(21);
    expect(parse('3*(5+2.5)').result).toBe(22.5);
    expect(parse('(-3)*(5-2.5)').result).toBe(-7.5);
  });
  
  test('parsing expression with variable table', () => {
    expect(parse('1 + $a', {a: 1}).result).toBe(2);
    expect(parse('-$a', {a: 1}).result).toBe(-1);
    expect(parse('3+ $b / $c', {b:4, c:2}).result).toBe(5);
  })
  
  test('中文支持', () => {
    expect(parse('1+$借方-$贷方', {借方: 20, 贷方:10}).result).toBe(11);
  })
  
  test('throwing error', () => {
    // const {result}
    expect(parse('$asdbsd').result).toBe(0);
  })
  
  test('comparison', () => {
    expect(parse('$a === $b', {a:1, b:2}).result).toBe(1);
    expect(parse('$a === $b', {a:1, b:1}).result).toBe('EQUAL');
  })
})

describe('path', () => {
  const path = paths.randomChoice();
  const {list} = get(bigArray, {path, withList:true});
  const pathName = list.map(({name}) => name);
  const {record, siblings} = get(bigArray, {path: pathName, column:'name'});
  const pathString = pathName.join('/');  

  test('name', () => {
    const {result, code} = parse(`YO:${pathName.join('/')}:1`, {}, {ARRAY:bigArray});
    expect(result).toBe(0);
    expect(code).toBe('SHEET_NOT_EXISTS');
  })

  test('incomplete path', () => {
    const nonExistPathString = pathString.slice(0, -3);
    const {result, code, siblings:sibs} = parse(`ARRAY:${nonExistPathString}`, {}, {ARRAY:bigArray}, 'name');
    expect(result).toBe(0);
    expect(code).toBe('RECORD_NOT_FOUND');
    expect(sibs).toBe(siblings);
  })

  test('complete path but no expr', () => {
    const {result, code} = parse(`ARRAY:${pathString}`, {}, {ARRAY:bigArray}, 'name');
    expect(result).toBe(0);
    expect(code).toBe("INCOMPLETE_REFERENCE_FORMAT");
  })

  test('not found var', () => {
    const {result, code} = parse(`ARRAY:${pathString}:$askd1`, {}, {ARRAY:bigArray}, 'name');
    expect(result).toBe(0);
    expect(code).toBe("VAR_NOT_FOUND");
  })

  test ('normal', () => {
    const {result, code} = parse(`ARRAY:${pathString}:($num * 2)+1`, {}, {ARRAY:bigArray}, 'name');
    expect(result).toBe(record.num * 2 + 1);
    expect(code).toBe(undefined);
  })
})