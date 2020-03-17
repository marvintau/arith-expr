{
	var thisParser = this;
    
  	function getVarTable(parser){
     	return parser.varTable || {};
  	}
}

Expression
  = head:Term tail:(_ ("+" / "-") _ Term)* {
      return tail.reduce(function(result, element) {
      	switch(element[1]){
        	case '+': return result + element[3];
            case '-': return result - element[3];
        }
      }, head);
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
  = "(" _ expr:Expression _ ")" { return expr; }
  / Variable
  / Real
  / Integer

Variable 'variable'
  = _ [A-Za-z\u4E00-\u9FA5][A-Za-z0-9\u4E00-\u9FA5_]* {
  	
    let varTable = getVarTable(thisParser);
    
    return (text() in varTable)
      ? varTable[text()]
      : error(`identifier [${text()}] not found in variable table`)
  }

Real 'real'
  = _ [+-]? Integer ('.' Integer ([eE] [+-] Integer)?)? { return parseFloat(text());}

Integer "integer"
  = _ [+-]? [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\n\r]*