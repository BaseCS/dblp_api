const _ = require('lodash');
const Country = require('./neo4j/country');

const _singleCountryWithDetails = function (record) {
  if (record.length) {
    const result = {};
    _.extend(result, new Country(record.get('country')));
    result.id = record._fields[0].identity.low,
    result.code = record._fields[0].properties.code,
    result.name = record._fields[0].properties.name
    return result;
  }
  else {
    return null;
  }
};

// return many countriess
function _manyCountries(neo4jResult) {
  return neo4jResult.records.map(r => new Country(r.get('country')))
}

// get a single country by id
const getById = function (session, id) {
  const query = [
    `MATCH (country:Country) WHERE ID(country) = ${id}`,
    'RETURN country',
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {id: id})
    ).then(result => {
      if (!_.isEmpty(result.records)) {
        return _singleCountryWithDetails(result.records[0]);
      }
      else {
        throw {message: 'country not found', status: 404}
      }
    });
};

// get all countriess
const getAll = function (session) {
  return session.readTransaction(txc =>
      txc.run('MATCH (country:Country) RETURN country LIMIT 100')
    ).then(result => _manyCountries(result));
};


module.exports = {
  getAll: getAll,
  getById: getById
};