// Import the lodash library and the DBLP module
const _ = require("lodash");
const DBLP = require("../models/neo4j/dblp");

// Function to process a single DBLP record with details
const _singleDBLPWithDetails = function (record) {
  if (record.length) {
    const result = {};
    // Extend the result with properties from the DBLP node
    _.extend(result, new DBLP(record.get("dblp")));
    // Set additional properties from the Neo4j record
    (result.id = record._fields[0].identity.low),
      (result.name = record._fields[0].properties.name);
    return result;
  } else {
    return null;
  }
};

// Function to process many DBLPs
function _manyDBLPS(neo4jResult) {
  return neo4jResult.records.map((r) => new DBLP(r.get("dblp")));
}

// Function to get a single DBLP by id
const getById = function (session, id) {
  const query = [
    `MATCH (dblp:DBLP) WHERE ID(dblp) = ${id}`,
    "RETURN dblp",
  ].join("\n");

  return session
    .readTransaction((txc) => txc.run(query, { id: id }))
    .then((result) => {
      if (!_.isEmpty(result.records)) {
        return _singleDBLPWithDetails(result.records[0]);
      } else {
        throw { message: "dblp not found", status: 404 };
      }
    });
};

// Function to get all DBLPs
const getAll = function (session) {
  return session
    .readTransaction((txc) =>
      txc.run("MATCH (dblp:DBLP) RETURN dblp LIMIT 100")
    )
    .then((result) => _manyDBLPS(result));
};

// Export the functions to be used in other parts of the application
module.exports = {
  getAll: getAll,
  getById: getById,
};
