const parser = require("./expr.pegjs")

module.exports = (expr, varTable={}) => {
  parser.varTable = varTable;
  return parser.parse(expr);
}