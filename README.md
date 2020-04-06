| Statements | Branches | Functions | Lines |
| -----------|----------|-----------|-------|
| ![Statements](https://img.shields.io/badge/Coverage-68.12%25-red.svg "Make me better!") | ![Branches](https://img.shields.io/badge/Coverage-56.91%25-red.svg "Make me better!") | ![Functions](https://img.shields.io/badge/Coverage-62.99%25-red.svg "Make me better!") | ![Lines](https://img.shields.io/badge/Coverage-66.67%25-red.svg "Make me better!") |

Simple Arithmetic Expression Evaluator
================

It supports validating and evaluating the arithmetic operation between
integer, real number and variables given by a plain JS object. The working
part is a parser generated from PEG.js. It's basically same to the simplest
example PEG.js (found [here](https://pegjs.org/online)), with some minor
feature added.

You may use this module to avoid the usage of `eval()` in some circumstances.
`eval()` is simple, but sometimes too simple. You may want to validate an
expression without actually evaluate it. And using eval will really bring
you some security concerns.

简单的算数运算求值。你可以用它来验证一个字符串是否是一个算数表达式。它支持
基本的整数和实数的四则运算。你还能传入一个变量表参数，然后让变量参与到运算中。
它背后是一个用PEG.js生成的parser。原理非常简单，几乎同[这里](https://pegjs.org/online)
的示例程序是一样的。

这个组件的意义可能主要在于帮助你避免一部分`eval()`的使用。`eval()`有些简单粗暴，
有的时候你需要的是判断一个表达式是否合法，而并不想通过对它求值后的结果来判断。
而且eval除了求值的结果也不能给你更多额外的信息。此外eval也会带来安全隐患。

E.g
```
const parse = require('arith-expr');


console.log(parse('1+1'));
// will get you 2.

console.log(parse('3 * (5 - 2)'));
// will get you 9;

console.log(parse('3 * 1.5'));
// 4.5

console.log(parse('3 + b / c', {b: 1, c:0.5}))
//5

console.log(parse('function(){}'))
// throws SyntaxError, 'identifier [function] not found ...' ;

console.log(parse('<>'))
// throws SyntaxError, 'Expected '(', but found ...';
```

