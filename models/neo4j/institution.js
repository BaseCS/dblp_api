// extracts just the data from the query results

const _ = require('lodash');

const Institution = module.exports = function (_node) {
  _.extend(this, _node.properties);
  this.id = _node.identity.low;
  this.is_uni = this.is_uni;
  this.name = this.name;
  this.FACULTY = this.FACULTY;
  this.COUNTRY = this.COUNTRY;
};