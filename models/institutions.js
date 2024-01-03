// Import the lodash library and the Institution module
const _ = require("lodash");
const Institution = require("../models/neo4j/institution");

// Function to process a single Institution record with details
const _singleInstitutionWithDetails = function (record) {
  if (record.length) {
    const result = {};
    let faculty_arr = [];
    record.forEach((element) => {
      let relationship_type = element._fields[2];
      // Extend the result with properties from the Institution node
      _.extend(result, new Institution(element.get("institution")));
      // Set additional properties from the Neo4j record
      (result.id = element._fields[0].identity.low),
        (result.is_uni = element._fields[0].properties.is_uni),
        (result.name = element._fields[0].properties.name);
      if (relationship_type == "BELONGS_TO") {
        faculty_arr.push(element._fields[1]);
      } else if (relationship_type == "IN") {
        result.COUNTRY = element._fields[1];
      }
      // Assign the related faculty and country to the result
      result.FACULTY = faculty_arr;
    });
    return result;
  } else {
    return null;
  }
};

// Function to process many Institutions
function _manyInstitutions(neo4jResult) {
  return neo4jResult.records.map((r) => {
    thisInstitution = new Institution(r.get("institution"));
    let type = r.get("r").type;
    let arr = [];
    arr.push(r.get("a"));
    if (type == "BELONGS_TO") {
      thisInstitution["FACULTY"] = arr;
    }
    if (type == "IN") {
      thisInstitution["COUNTRY"] = arr;
    }
    return thisInstitution;
  });
}

// Function to get a single institution by id
const getById = function (session, id) {
  const query = [
    `MATCH (a)-[r]-(institution:Institution)
    WHERE ID(institution) = ${id}
    RETURN institution, a, type(r)`,
  ].join("\n");

  return session
    .readTransaction((txc) => txc.run(query, { id: id }))
    .then((result) => {
      if (!_.isEmpty(result.records)) {
        return _singleInstitutionWithDetails(result.records);
      } else {
        throw { message: "institution not found", status: 404 };
      }
    });
};

// Function to get all institutions
const getAll = function (session) {
  return session
    .readTransaction((txc) =>
      txc.run(
        `MATCH (a)-[r]-(institution:Institution) RETURN a, r, institution`
      )
    )
    .then((result) => {
      let res = _manyInstitutions(result);
      console.log(res);
      return mergeIds(res);
    });
};

// Function to merge institution entries by their IDs
const mergeIds = (list) => {
  const subarrsById = {};
  for (const entry of list) {
    if (!subarrsById[entry.id]) {
      if (entry.FACULTY) {
        subarrsById[entry.id] = {
          ...entry,
          FACULTY: [...entry.FACULTY],
          COUNTRY: entry.COUNTRY,
        };
      }
    } else {
      if (entry.FACULTY) subarrsById[entry.id].FACULTY.push(...entry.FACULTY);
      if (entry.COUNTRY) subarrsById[entry.id].COUNTRY = entry.COUNTRY;
    }
  }
  console.log(subarrsById);
  return Object.values(subarrsById);
};

// Export the functions to be used in other parts of the application
module.exports = {
  getAll: getAll,
  getById: getById,
};
