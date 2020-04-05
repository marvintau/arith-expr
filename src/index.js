const {get, add} = require('@marvintau/chua');
const parser = require("./expr.pegjs")

module.exports = (expr, varTable, data={}, column="ccode_name") => {
  parser.varTable = varTable;
  parser.data = data;
  parser.get = get;
  parser.column = column;
  return parser.parse(expr);
}