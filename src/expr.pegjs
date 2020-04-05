{
	var parserInstance = this;
    
  var {varTable={}, data={}, get, column} = parserInstance;

  var vars = {...varTable};

  var currArray;

}

PathExpr
  = SheetName ":" siblings:Path expr:(":" Expr)* {
    return {
      siblings,
      result: expr.length > 0 ? expr[0][1] : undefined
    }
  }
  / Expr

SheetName
  = Literal {
    const sheetName = text();

    if(data[sheetName] === undefined){
      error(`Sheet name does not exist in given dataset.`);
    } else {
      currArray = data[sheetName];
    }
  }

Path
  = head:Literal tail:("/" Literal)* {
    if (currArray === undefined){
      error(`Encountered path before sheet initialized`);
    }
    const path = tail.reduce((result, elem) => {
      return result.concat(elem[1]);
    }, [head]);

    const {record, siblings} = get(currArray, {path, column})

    if (record !== undefined){
      Object.assign(vars, varTable, record);
    }

    return siblings;
  }

Expr
  = Comp
  / ExprAlt

Comp
  = first:Factor _ "===" _ last:Factor {
    return (first === last)
    ? 'EQUAL'
    : Math.abs(first - last);
  }

ExprAlt
  = head:(Term)? tail:(_ ("+" / "-") _ Term)* {
      return tail.reduce(function(result, element) {
      	switch(element[1]){
        	case '+': return result + element[3];
          case '-': return result - element[3];
        }
      }, head ? head : 0);
    }

Term
  = head:Factor tail:(_ ("*" / "/") _ Factor)* {
      return tail.reduce(function(result, element) {
      	switch(element[1]){
        	case '*': return result * element[3];
          case '/': return result / element[3];
        }
      }, head);
    }

Factor
  = "(" _ expr:ExprAlt _ ")" { return expr; }
  / Variable
  / Real
  / Integer

Variable 'variable'
  = _ '$' lit:Literal* {

    return !(lit in vars)
    ? error(`Identifier [${lit}] not found in variable table`)
    : vars[lit]
  }

Literal 'literal'
  = [A-Za-z\u4E00-\u9FA5][A-Za-z0-9\u4E00-\u9FA5_]* {
    return text();
  }

Real 'real'
  = _ Integer ('.' Integer ([eE] [+-] Integer)?)? { return parseFloat(text());}

Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\n\r]*