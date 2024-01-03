// Extracts just the data from the query results

const _ = require("lodash");

// Create a constructor function for the Paper object
const Paper = (module.exports = function (_node) {
  // Initialize the Paper object by extending it with the properties of the _node object
  _.extend(this, _node.properties);

  // Assign additional properties to the Paper object
  this.id = _node.identity.low;
  this.DBLP_type = this.DBLP_type;
  this.electronic_edition = this.electronic_edition;
  this.notes = this.notes;
  this.source = this.source;
  this.title = this.title;
  this.url = this.url;
  this.volume = this.volume;
  this.year = this.year;
});

// Export the Paper constructor function as a module
