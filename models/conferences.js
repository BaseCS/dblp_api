// Import necessary modules
const _ = require("lodash");
const Conference = require("../models/neo4j/conference");

// Helper function to map a single conference with details from a Neo4j record
const _singleConferenceWithDetails = function (record) {
  if (record.length) {
    const result = {};
    _.extend(result, new Conference(record.get("conference")));
    result.id = record._fields[0].identity.low;
    result.name = record._fields[0].properties.name;
    return result;
  } else {
    return null;
  }
};

// Function to return multiple conferences
function _manyConferences(neo4jResult) {
  return neo4jResult.records.map((r) => new Conference(r.get("conference")));
}

// Function to get a single conference by ID
const getById = function (session, id) {
  // Define the Cypher query to match a conference by its ID
  const query = [
    `MATCH (conference:Conference) WHERE ID(conference) = ${id}`,
    "RETURN conference",
  ].join("\n");

  // Execute the query within a read transaction and handle the result
  return session
    .readTransaction((txc) => txc.run(query, { id: id }))
    .then((result) => {
      if (!_.isEmpty(result.records)) {
        return _singleConferenceWithDetails(result.records[0]);
      } else {
        throw { message: "conference not found", status: 404 };
      }
    });
};

// Function to get papers associated with a conference by its ID
const getPapersByConferenceId = function (session, id) {
  // Define the Cypher query to match a conference by its ID and retrieve associated papers
  const query = [
    `MATCH (conference:Conference) WHERE ID(conference) = ${id}`,
    "MATCH (conference)<-[:PUBLISHED_IN]-(paper:Paper)",
    "RETURN conference, COLLECT(paper) AS papers",
  ].join("\n");

  // Execute the query within a read transaction and handle the result
  return session
    .readTransaction((txc) => txc.run(query, { id: id }))
    .then((result) => {
      if (!_.isEmpty(result.records)) {
        return _singleConferenceWithDetails(result.records[0]);
      } else {
        throw { message: "conference not found", status: 404 };
      }
    });
};

// Function to get all conferences
const getAll = function (session) {
  // Define the Cypher query to retrieve all conferences with a limit of 100
  return session
    .readTransaction((txc) =>
      txc.run("MATCH (conference:Conference) RETURN conference LIMIT 100")
    )
    .then((result) => _manyConferences(result));
};

// Export the functions as modules
module.exports = {
  getAll: getAll,
  getById: getById,
  getPapersByConferenceId: getPapersByConferenceId,
};
