// extracts just the data from the query results

const _ = require('lodash');

const Journal = module.exports = function (_node) {
  _.extend(this, _node.properties);
  this.id = _node.identity.low;
  this.name = this.name;
};