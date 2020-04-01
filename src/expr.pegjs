{
	var thisParser = this;
    
  function getVarTable(parser){
    return parser.varTable || {};
  }
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
  = _ [A-Za-z\u4E00-\u9FA5][A-Za-z0-9\u4E00-\u9FA5_]* {

    let varTable = getVarTable(thisParser);

    let variable = text();
    return !(variable in varTable)
    ? error(`identifier [${variable}] not found in variable table`)
    : varTable[variable]
  }

Real 'real'
  = _ Integer ('.' Integer ([eE] [+-] Integer)?)? { return parseFloat(text());}

Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\n\r]*