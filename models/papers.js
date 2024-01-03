// Import the lodash library and the Paper module
const _ = require("lodash");
const Paper = require("../models/neo4j/paper");

// Function to process a single Paper record with details
const _singlePaperWithDetails = function (record) {
  if (record.length) {
    const result = {};
    // Extend the result with properties from the Paper node
    _.extend(result, new Paper(record.get("paper")));
    // Set additional properties from the Neo4j record
    (result.id = record._fields[0].identity.low),
      (result.DBLP_type = record._fields[0].properties.DBLP_type),
      (result.electronic_edition =
        record._fields[0].properties.electronic_edition),
      (result.notes = record._fields[0].properties.notes),
      (result.source = record._fields[0].properties.source),
      (result.url = record._fields[0].properties.url),
      (result.volume = record._fields[0].properties.volume),
      (result.year = record._fields[0].properties.year),
      (result.title = record._fields[0].properties.title);
    return result;
  } else {
    return null;
  }
};

// Function to process many Papers
function _manyPapers(neo4jResult) {
  return neo4jResult.records.map((r) => new Paper(r.get("paper")));
}

// Function to get a single paper by id
const getById = function (session, id) {
  const query = [
    `MATCH (paper:Paper) WHERE ID(paper) = ${id}`,
    "RETURN paper",
  ].join("\n");

  return session
    .readTransaction((txc) => txc.run(query, { id: id }))
    .then((result) => {
      if (!_.isEmpty(result.records)) {
        return _singlePaperWithDetails(result.records[0]);
      } else {
        throw { message: "paper not found", status: 404 };
      }
    });
};

// Function to get people related to a paper by id
const getPeopleByPaperId = function (session, id) {
  const query = [
    `MATCH (paper:Paper) WHERE ID(paper) = ${id}`,
    "MATCH (paper)<-[:AUTHORED]-(author:Person)",
    "RETURN paper, COLLECT(author) AS authors",
  ].join("\n");

  return session
    .readTransaction((txc) => txc.run(query, { id: id }))
    .then((result) => {
      if (!_.isEmpty(result.records)) {
        return _singlePaperWithDetails(result.records[0]);
      } else {
        throw { message: "paper not found", status: 404 };
      }
    });
};

// Function to get all papers
const getAll = function (session) {
  return session
    .readTransaction((txc) =>
      txc.run("MATCH (paper:Paper) RETURN paper LIMIT 100")
    )
    .then((result) => _manyPapers(result));
};

// Export the functions to be used in other parts of the application
module.exports = {
  getAll: getAll,
  getById: getById,
  getPeopleByPaperId: getPeopleByPaperId,
};
