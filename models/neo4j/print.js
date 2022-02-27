// extracts just the data from the query results

const _ = require('lodash');

const Print = module.exports = function (_node) {
  _.extend(this, _node.properties);
  this.id = _node.identity.low;
  this.DBLP_type = this.DBLP_typ;
  this.electronic_edition = this.electronic_edition;
  this.isbn = this.isbn;
  this.number_of_pages = this.number_of_pages;
  this.pages = this.pages;
  this.publisher = this.publisher;
  this.series = this.series;
  this.tite = this.title;
  this.year = this.year;
};