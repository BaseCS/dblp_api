// Import the lodash library for utility functions
const _ = require("lodash");

// Create a constructor function for the Anthology object
const Anthology = (module.exports = function (_node) {
  // Initialize the Anthology object by extending it with the properties of the _node object
  _.extend(this, _node.properties);

  // Assign additional properties to the Anthology object
  this.id = _node.identity.low;
  this.DBLP_type = this.DBLP_type;
  this.electronic_edition = this.electronic_edition;
  this.isbn = this.isbn;
  this.publisher = this.publisher;
  this.series = this.series;
  this.title = this.title;
  this.year = this.year;
});

// Export the Anthology constructor function as a module
