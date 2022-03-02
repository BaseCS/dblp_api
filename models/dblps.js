const _ = require('lodash');
const DBLP = require('../models/neo4j/dblp');

const _singleDBLPWithDetails = function (record) {
  if (record.length) {
    const result = {};
    _.extend(result, new DBLP(record.get('dblp')));
    result.id = record._fields[0].identity.low,
    result.name = record._fields[0].properties.name
    return result;
  }
  else {
    return null;
  }
};

// return many dblps
function _manyDBLPS(neo4jResult) {
  return neo4jResult.records.map(r => new DBLP(r.get('dblp')))
}

// get a single dblp by id
const getById = function (session, id) {
  const query = [
    `MATCH (dblp:DBLP) WHERE ID(dblp) = ${id}`,
    'RETURN dblp',
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {id: id})
    ).then(result => {
      if (!_.isEmpty(result.records)) {
        return _singleDBLPWithDetails(result.records[0]);
      }
      else {
        throw {message: 'dblp not found', status: 404}
      }
    });
};

// get all dblps
const getAll = function (session) {
  return session.readTransaction(txc =>
      txc.run('MATCH (dblp:DBLP) RETURN dblp LIMIT 100')
    ).then(result => _manyDBLPS(result));
};


module.exports = {
  getAll: getAll,
  getById: getById
};