// extracts just the data from the query results

const _ = require('lodash');

const Paper = module.exports = function (_node) {
  _.extend(this, _node.properties);
  this.id = _node.identity.low;
  this.DBLP_type = this.DBLP_type;
  this.electronic_edition = this.electronic_edition;
  this.notes = this.notes;
  this.source = this.source;
  this.title = this.title;
  this.url = this.url;
  this.volume = this.volume;
  this.year = this.year;
};