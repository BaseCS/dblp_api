// Import the lodash library for utility functions
const _ = require("lodash");

// Create a constructor function for the Institution object
const Institution = (module.exports = function (_node) {
  // Initialize the Institution object by extending it with the properties of the _node object
  _.extend(this, _node.properties);

  // Assign additional properties to the Institution object
  this.id = _node.identity.low;
  this.is_uni = this.is_uni;
  this.name = this.name;
  this.FACULTY = this.FACULTY;
  this.COUNTRY = this.COUNTRY;
});

// Export the Institution constructor function as a module
