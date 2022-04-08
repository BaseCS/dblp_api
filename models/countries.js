const _ = require('lodash');
const Country = require('./neo4j/country');

const _singleCountryWithDetails = function (record) {
  if (record.length) {
    const result = {};
    let inst_arr = [];
    let cont={};
    record.forEach(element => {
      _.extend(result, new Country(element.get('country')));
      result.id = element._fields[1].identity.low,
      result.code = element._fields[1].properties.code,
      result.name = element._fields[1].properties.name
      if(element._fields[2].labels.includes('Institution')){
        inst_arr.push(element._fields[2]);
      } else if(element._fields[2].labels.includes('Continent')){
        cont = element._fields[2]
      }
      result.INSTITUTIONS = inst_arr;
      result.CONTINENT = cont;
    })
    return result;
  }
  else {
    return null;
  }
};

// return many countriess
function _manyCountries(neo4jResult) {
  // return neo4jResult.records.map(r => new Country(r.get('country')))
  return neo4jResult.records.map(r => {
    cty = new Country(r.get('country'));
    let arr = [];
    let rel = r.get('b')
    if(rel.labels.includes('Institution')){
      arr.push(rel);
    }
    cty.CONTINENT = rel;
    cty.INSTITUTIONS = arr;
    return cty;
  });
}

// get a single country by id
const getById = function (session, id) {
  const query = [
    `MATCH (country:Country)-[r]-(b)
    WHERE ID(country) = ${id}
    RETURN type(r), country, b`,
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {id: id})
    ).then(result => {
      if (!_.isEmpty(result.records)) {
        return _singleCountryWithDetails(result.records);
      }
      else {
        throw {message: 'country not found', status: 404}
      }
    });
};

// get all countriess
const getAll = function (session) {
  return session.readTransaction(txc =>
      txc.run('MATCH (country:Country)-[r]-(b) RETURN r, country, b LIMIT 500')
    ).then(result => {
      let res = _manyCountries(result);
      console.log(mergeIds(res))
      return mergeIds(res);
    });
};

const mergeIds = (list) => {
  const subarrsById = {};
  for (const entry of list) {
    if(!subarrsById[entry.id]){
      if(entry.INSTITUTIONS){
        subarrsById[entry.id] = { ...entry, INSTITUTIONS: [...entry.INSTITUTIONS], CONTINENT: entry.CONTINENT};
      }
    } else {
      if(entry.INSTITUTIONS)
        subarrsById[entry.id].INSTITUTIONS.push(...entry.INSTITUTIONS);
      if(entry.CONTINENT)
        subarrsById[entry.id].CONTINENT = entry.CONTINENT;
    }
  }
  return Object.values(subarrsById);
}


module.exports = {
  getAll: getAll,
  getById: getById
};