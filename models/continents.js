const _ = require('lodash');
const Continent = require('../models/neo4j/continent');

const _singleContinentWithDetails = function (record) {
  if (record.length) {
    const result = {};
    _.extend(result, new Continent(record.get('continent')));
    result.id = record._fields[0].identity.low,
    result.code = record._fields[0].properties.code,
    result.name = record._fields[0].properties.name
    return result;
  }
  else {
    return null;
  }
};

// return many continents
function _manyContinents(neo4jResult) {
  return neo4jResult.records.map(r => new Continent(r.get('continent')))
}

// get a single continent by id
const getById = function (session, id) {
  const query = [
    `MATCH (continent:Continent) WHERE ID(continent) = ${id}`,
    'RETURN continent',
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {id: id})
    ).then(result => {
      if (!_.isEmpty(result.records)) {
        return _singleContinentWithDetails(result.records[0]);
      }
      else {
        throw {message: 'continent not found', status: 404}
      }
    });
};

// get all continents
const getAll = function (session) {
  return session.readTransaction(txc =>
      txc.run('MATCH (continent:Continent) RETURN continent LIMIT 100')
    ).then(result => _manyContinents(result));
};


module.exports = {
  getAll: getAll,
  getById: getById
};