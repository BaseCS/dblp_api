// extracts just the data from the query results

const _ = require('lodash');

const Person = module.exports = function (_node) {
  _.extend(this, _node.properties);
  this.id = _node.identity.low;
  this.name = this.name;
  this.affiliation = this.affiliation;
  this.homepage = this.homepage;
  this.unicode_name = this.unicode_name;
  this.notes = this.notes;
};