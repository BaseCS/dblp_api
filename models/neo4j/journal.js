// Import the lodash library for utility functions
const _ = require('lodash');

// Create a constructor function for the Journal object
const Journal = module.exports = function (_node) {
  // Initialize the Journal object by extending it with the properties of the _node object
  _.extend(this, _node.properties);

  // Assign additional properties to the Journal object
  this.id = _node.identity.low;
  this.name = this.name;
};

// Export the Journal constructor function as a module
