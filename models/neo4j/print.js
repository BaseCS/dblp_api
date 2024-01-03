// Extracts just the data from the query results

const _ = require("lodash");

// Create a constructor function for the Person object
const Person = (module.exports = function (_node) {
  // Initialize the Person object by extending it with the properties of the _node object
  _.extend(this, _node.properties);

  // Assign additional properties to the Person object
  this.id = _node.identity.low;
  this.name = this.name;
  this.affiliation = this.affiliation;
  this.homepage = this.homepage;
  this.unicode_name = this.unicode_name;
  this.notes = this.notes;
  this.AUTHORED = this.AUTHORED;
  this.BELONGS_TO = this.BELONGS_TO;
});

// Export the Person constructor function as a module
