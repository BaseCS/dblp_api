// Import the lodash library for utility functions
const _ = require("lodash");

// Create a constructor function for the Country object
const Country = (module.exports = function (_node) {
  // Initialize the Country object by extending it with the properties of the _node object
  _.extend(this, _node.properties);

  // Assign additional properties to the Country object
  this.id = _node.identity.low;
  this.code = this.code;
  this.name = this.name;
  this.INSTITUTIONS = this.INSTITUTIONS;
  this.CONTINENT = this.CONTINENT;
});

// Export the Country constructor function as a module
