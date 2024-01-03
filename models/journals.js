// Import the lodash library and the Journal module
const _ = require("lodash");
const Journal = require("../models/neo4j/journal");

// Function to process a single Journal record with details
const _singleJournalWithDetails = function (record) {
  if (record.length) {
    const result = {};
    // Extend the result with properties from the Journal node
    _.extend(result, new Journal(record.get("journal")));
    // Set additional properties from the Neo4j record
    (result.id = record._fields[0].identity.low),
      (result.name = record._fields[0].properties.name);
    return result;
  } else {
    return null;
  }
};

// Function to process many Journals
function _manyJournals(neo4jResult) {
  return neo4jResult.records.map((r) => new Journal(r.get("journal")));
}

// Function to get a single journal by id
const getById = function (session, id) {
  const query = [
    `MATCH (journal:Journal) WHERE ID(journal) = ${id}`,
    "RETURN journal",
  ].join("\n");

  return session
    .readTransaction((txc) => txc.run(query, { id: id }))
    .then((result) => {
      if (!_.isEmpty(result.records)) {
        return _singleJournalWithDetails(result.records[0]);
      } else {
        throw { message: "journal not found", status: 404 };
      }
    });
};

// Function to get all journals
const getAll = function (session) {
  return session
    .readTransaction((txc) =>
      txc.run("MATCH (journal:Journal) RETURN journal LIMIT 100")
    )
    .then((result) => _manyJournals(result));
};

// Export the functions to be used in other parts of the application
module.exports = {
  getAll: getAll,
  getById: getById,
};
