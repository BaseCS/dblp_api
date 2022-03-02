// extracts just the data from the query results

const _ = require('lodash');

const Anthology = module.exports = function (_node) {
  _.extend(this, _node.properties);
  this.id = _node.identity.low;
  this.DBLP_type = this.DBLP_type;
  this.electronic_edition = this.electronic_edition;
  this.isbn = this.isbn;
  this.publisher = this.publisher;
  this.series = this.series;
  this.title = this.title;
  this.year = this.year;
};