const _ = require("lodash"); // Import the lodash library for utility functions
const Anthology = require("../models/neo4j/anthology"); // Import the Anthology model

// Function to convert a single anthology record into a structured object with details
const _singleAnthologyWithDetails = function (record) {
  if (record.length) {
    const result = {};
    _.extend(result, new Anthology(record.get("anthology")));
    (result.id = record._fields[0].identity.low),
      (result.DBLP_type = record._fields[0].properties.DBLP_type),
      (result.isbn = record._fields[0].properties.isbn),
      (result.year = record._fields[0].properties.year),
      (result.series = record._fields[0].properties.series),
      (result.publisher = record._fields[0].properties.publisher),
      (result.title = record._fields[0].properties.title),
      (result.electronic_edition =
        record._fields[0].properties.electronic_edition);
    return result;
  } else {
    return null;
  }
};

// Function to convert multiple anthology records into an array of Anthology objects
function _manyAnthologies(neo4jResult) {
  return neo4jResult.records.map((r) => new Anthology(r.get("anthology")));
}

// Function to get a single anthology by ID
const getById = function (session, id) {
  const query = [
    `MATCH (anthology:Anthology) WHERE ID(anthology) = ${id}`,
    "RETURN anthology",
  ].join("\n");

  return session
    .readTransaction((txc) => txc.run(query, { id: id }))
    .then((result) => {
      if (!_.isEmpty(result.records)) {
        return _singleAnthologyWithDetails(result.records[0]);
      } else {
        throw { message: "anthology not found", status: 404 };
      }
    });
};

// Function to get all anthologies
const getAll = function (session) {
  return session
    .readTransaction((txc) =>
      txc.run("MATCH (anthology:Anthology) RETURN anthology LIMIT 100")
    )
    .then((result) => _manyAnthologies(result));
};

// Export the functions as part of a module
module.exports = {
  getAll: getAll, // Expose the getAll function
  getById: getById, // Expose the getById function
};
