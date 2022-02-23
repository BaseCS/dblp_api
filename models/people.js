const _ = require('lodash');
const Person = require('../models/neo4j/person');

const _singlePersonWithDetails = function (record) {
  if (record.length) {
    const result = {};
    _.extend(result, new Person(record.get('person')));
    result.id = record._fields[0].identity.low,
    result.name = record._fields[0].properties.name,
    result.homepage = record._fields[0].properties.homepage,
    result.unicode_name = record._fields[0].properties.unicode_name,
    result.affiliation = record._fields[0].properties.affiliation,
    result.notes = record._fields[0].properties.notes
    return result;
  }
  else {
    return null;
  }
};

// return many people
function _manyPeople(neo4jResult) {
  return neo4jResult.records.map(r => new Person(r.get('person')))
}

// get a single person by id
const getById = function (session, id) {
  const query = [
    `MATCH (person:Person) WHERE ID(person) = ${id}`,
    'OPTIONAL MATCH (person)-[:AUTHORED]->(a:Print)',
    'OPTIONAL MATCH (person)<-[:EDITED]->(e:Anthology)',
    'OPTIONAL MATCH (person)<-[:AUTHORED]->(p:Paper)',
    'RETURN person,',
    'collect(DISTINCT { title:a.title, id:a.identity.low, year:a.year, series:a.series, \
        isbn: a.isbn, publisher: a.publisher, electronic_edition: a.electronic_edition, \
        DBLP_type: a.DBLP_type}) AS authored_print,',
    'collect(DISTINCT { title:e.title, id:e.identity.low, year:e.year, isbn: e.isbn, \
        publisher: e.publisher, electronic_edition: e.electronic_edition, DBLP_type: e.DBLP_type}) AS edited,',
    'collect(DISTINCT { title:p.title, id:p.identity.low, year:p.year, source:p.source, \
        electronic_edition: p.electronic_edition, DBLP_type: p.DBLP_type}) AS authored_paper',
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {id: id})
    ).then(result => {
        // console.log(result.records)
      if (!_.isEmpty(result.records)) {
        return _singlePersonWithDetails(result.records[0]);
      }
      else {
        throw {message: 'person not found', status: 404}
      }
    });
};

// get all people
const getAll = function (session) {
  return session.readTransaction(txc =>
      txc.run('MATCH (person:Person) RETURN person LIMIT 100')
    ).then(result => _manyPeople(result));
};


module.exports = {
  getAll: getAll,
  getById: getById
};