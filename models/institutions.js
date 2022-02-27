const _ = require('lodash');
const Institution = require('../models/neo4j/institution');

const _singleInstitutionWithDetails = function (record) {
  if (record.length) {
    const result = {};
    _.extend(result, new Institution(record.get('institution')));
    result.id = record._fields[0].identity.low,
    result.is_uni = record._fields[0].properties.is_uni,
    result.name = record._fields[0].properties.name
    return result;
  }
  else {
    return null;
  }
};

// return many Institutions
function _manyInstitutions(neo4jResult) {
  return neo4jResult.records.map(r => new Institution(r.get('institution')))
}

// get a single institution by id
const getById = function (session, id) {
  const query = [
    `MATCH (institution:Institution) WHERE ID(institution) = ${id}`,
    'RETURN institution',
    ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {id: id})
    ).then(result => {
        // console.log(result.records)
      if (!_.isEmpty(result.records)) {
        return _singleInstitutionWithDetails(result.records[0]);
      }
      else {
        throw {message: 'institution not found', status: 404}
      }
    });
};

// get all institutions
const getAll = function (session) {
  return session.readTransaction(txc =>
      txc.run('MATCH (institution:Institution) RETURN institution LIMIT 100')
    ).then(result => _manyInstitutions(result));
};


module.exports = {
  getAll: getAll,
  getById: getById
};