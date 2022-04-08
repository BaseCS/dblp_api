// extracts just the data from the query results

const _ = require('lodash');

const Continent = module.exports = function (_node) {
  _.extend(this, _node.properties);
  this.id = _node.identity.low;
  this.code = this.code;
  this.name = this.name;
  this.COUNTRIES = this.COUNTRIES;
};