const _ = require('lodash');
const Conference = require('../models/neo4j/conference');

const _singleConferenceWithDetails = function (record) {
  if (record.length) {
    const result = {};
    _.extend(result, new Conference(record.get('conference')));
    result.id = record._fields[0].identity.low,
    result.name = record._fields[0].properties.name
    return result;
  }
  else {
    return null;
  }
};

// return many conferences
function _manyConferences(neo4jResult) {
  return neo4jResult.records.map(r => new Conference(r.get('conference')))
}

// get a single conference by id
const getById = function (session, id) {
  const query = [
    `MATCH (conference:Conference) WHERE ID(conference) = ${id}`,
    'RETURN conference',
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {id: id})
    ).then(result => {
      if (!_.isEmpty(result.records)) {
        return _singleConferenceWithDetails(result.records[0]);
      }
      else {
        throw {message: 'conference not found', status: 404}
      }
    });
};

const getPapersByConferenceId = function (session, id) {
  const query = [
    `MATCH (conference:Conference) WHERE ID(conference) = ${id}`,
    'MATCH (conference)<-[:PUBLISHED_IN]-(paper:Paper)',
    'RETURN conference, COLLECT(paper) AS papers',
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {id: id})
    ).then(result => {
      if (!_.isEmpty(result.records)) {
        return _singleConferenceWithDetails(result.records[0]);
      }
      else {
        throw {message: 'conference not found', status: 404}
      }
    });
}

// get all conferences
const getAll = function (session) {
  return session.readTransaction(txc =>
      txc.run('MATCH (conference:Conference) RETURN conference LIMIT 100')
    ).then(result => _manyConferences(result));
};


module.exports = {
  getAll: getAll,
  getById: getById,
  getPapersByConferenceId: getPapersByConferenceId
};