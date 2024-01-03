// Import the lodash library for utility functions
const _ = require("lodash");

// Create a constructor function for the Continent object
const Continent = (module.exports = function (_node) {
  // Initialize the Continent object by extending it with the properties of the _node object
  _.extend(this, _node.properties);

  // Assign additional properties to the Continent object
  this.id = _node.identity.low;
  this.code = this.code;
  this.name = this.name;
  this.COUNTRIES = this.COUNTRIES;
});

// Export the Continent constructor function as a module
