// Import the lodash library for utility functions
const _ = require("lodash");

// Create a constructor function for the Conference object
const Conference = (module.exports = function (_node) {
  // Initialize the Conference object by extending it with the properties of the _node object
  _.extend(this, _node.properties);

  // Assign additional properties to the Conference object
  this.id = _node.identity.low;
  this.name = this.name;
});

// Export the Conference constructor function as a module
