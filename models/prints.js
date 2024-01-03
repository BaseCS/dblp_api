const _ = require("lodash");
const Print = require("../models/neo4j/print");

const _singlePrintWithDetails = function (record) {
  if (record.length) {
    const result = {};
    _.extend(result, new Print(record.get("print")));
    (result.id = record._fields[0].identity.low),
      (result.DBLP_type = record._fields[0].properties.DBLP_type),
      (result.isbn = record._fields[0].properties.isbn),
      (result.year = record._fields[0].properties.year),
      (result.number_of_pages = record._fields[0].properties.number_of_pages),
      (result.pages = record._fields[0].properties.pages),
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

// return many prints
function _manyPrints(neo4jResult) {
  return neo4jResult.records.map((r) => new Print(r.get("print")));
}

// get a single print by id
const getById = function (session, id) {
  const query = [
    `MATCH (print:Print) WHERE ID(print) = ${id}`,
    "RETURN print",
  ].join("\n");

  return session
    .readTransaction((txc) => txc.run(query, { id: id }))
    .then((result) => {
      if (!_.isEmpty(result.records)) {
        return _singlePrintWithDetails(result.records[0]);
      } else {
        throw { message: "print not found", status: 404 };
      }
    });
};

// get all prints
const getAll = function (session) {
  return session
    .readTransaction((txc) =>
      txc.run("MATCH (print:Print) RETURN print LIMIT 100")
    )
    .then((result) => _manyPrints(result));
};

module.exports = {
  getAll: getAll,
  getById: getById,
};
