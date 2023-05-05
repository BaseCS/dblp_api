const _ = require('lodash');
const Paper = require('../models/neo4j/paper');

const _singlePaperWithDetails = function (record) {
  if (record.length) {
    const result = {};
    _.extend(result, new Paper(record.get('paper')));
    result.id = record._fields[0].identity.low,
    result.DBLP_type = record._fields[0].properties.DBLP_type,
    result.electronic_edition = record._fields[0].properties.electronic_edition,
    result.notes = record._fields[0].properties.notes,
    result.source = record._fields[0].properties.source,
    result.url = record._fields[0].properties.url,
    result.volume = record._fields[0].properties.volume,
    result.year = record._fields[0].properties.year,
    result.title = record._fields[0].properties.title
    return result;
  }
  else {
    return null;
  }
};

// return many papers
function _manyPapers(neo4jResult) {
  return neo4jResult.records.map(r => new Paper(r.get('paper')))
}

// get a single paper by id
const getById = function (session, id) {
  const query = [
    `MATCH (paper:Paper) WHERE ID(paper) = ${id}`,
    'RETURN paper',
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {id: id})
    ).then(result => {
      if (!_.isEmpty(result.records)) {
        return _singlePaperWithDetails(result.records[0]);
      }
      else {
        throw {message: 'paper not found', status: 404}
      }
    });
};

const peopleByPaperId = function (session, id) {
  const query = [
    `MATCH (paper:Paper) WHERE ID(paper) = ${id}`,
    'MATCH (paper)<-[:AUTHORED]-(author:Person)',
    'RETURN paper, COLLECT(author) AS authors',
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {id: id})
    ).then(result => {
      if (!_.isEmpty(result.records)) {
        return _singlePaperWithDetails(result.records[0]);
      }
      else {
        throw {message: 'paper not found', status: 404}
      }
    });
      
  }


// get all papers
const getAll = function (session) {
  return session.readTransaction(txc =>
      txc.run('MATCH (paper:Paper) RETURN paper LIMIT 100')
    ).then(result => _manyPapers(result));
};


module.exports = {
  getAll: getAll,
  getById: getById
};