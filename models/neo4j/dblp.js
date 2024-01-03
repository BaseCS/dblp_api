// Import the lodash library for utility functions
const _ = require("lodash");

// Create a constructor function for the DBLP object
const DBLP = (module.exports = function (_node) {
  // Initialize the DBLP object by extending it with the properties of the _node object
  _.extend(this, _node.properties);

  // Assign additional properties to the DBLP object
  this.id = _node.identity.low;
  this.name = this.name;
});

// Export the DBLP constructor function as a module
