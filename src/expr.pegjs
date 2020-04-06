{
	var parserInstance = this;
    
  var {varTable={}, data={}, get, column} = parserInstance;

  var vars = {...varTable};

  var currArray;
  var error = {};
}

PathExpr
  = SheetName ":" siblings:Path expr:(":" Expr)* {

    let {Sheet, Path, Var} = error;

    let code, result;
    if (Sheet) {
      code = Sheet;
      result = 0;
    } else if (Path){
      code = Path;
      result = 0;
    } else {
      if (Path){
        code = Path;
        result = 0;
      } else if (expr.length === 0){
        code = 'INCOMPLETE_REFERENCE_FORMAT'
        result = 0;
      } else if (Var) {
        code = error.Var.code;
        result = 0;
      } else {
        const {result:exprRes, code:exprCode} = expr[0][1];
        result = exprRes;
        code   = exprCode;
      }
    }
    return { siblings, result, code}
  }
  / Expr

SheetName
  = Literal {
    const sheetName = text();

    if(data[sheetName] === undefined){
      error.Sheet = 'SHEET_NOT_EXISTS';
    } else {
      currArray = data[sheetName];
    }
  }

Path
  = head:Literal tail:("/" Literal)* {

    // By here we did the parsing
    if (error.Sheet) {
      error.Path = error.Sheet;
      return;
    }

    const path = tail.reduce((result, elem) => {
      return result.concat(elem[1]);
    }, [head]);

    const {record, siblings} = get(currArray, {path, column})

    let code;
    if (record !== undefined){
      Object.assign(vars, varTable, record);
    } else {
      error.Path = 'RECORD_NOT_FOUND';
    }

    return siblings;
  }

Expr
  = Comp
  / ExprAlt

Comp
  = first:Factor _ "===" _ last:Factor {
    
    if (error.Var){
      return {
        result: 0,
        code: error.Var
      }
    } else {
      return { result: (first === last) ? 'EQUAL' : Math.abs(first - last) }
    }

  }

ExprAlt
  = head:(Term)? tail:(_ ("+" / "-") _ Term)* {

    if (error.Var) {
      return {
        result: 0,
        code: error.Var
      }
    } else {
      const result = tail.reduce(function(result, element) {
      	switch(element[1]){
        	case '+': return result + element[3];
          case '-': return result - element[3];
        }
      }, head ? head : 0);
      return {result};
    }

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
  = "(" _ expr:ExprAlt _ ")" { return expr.result; }
  / Variable
  / Real
  / Integer

Variable 'variable'
  = _ '$' lit:Literal* {

    if (!(lit in vars)){
      error.Var = {code: 'VAR_NOT_FOUND', varNme:lit};
      return 0;
    } else {
      return vars[lit];
    }
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