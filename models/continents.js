const _ = require('lodash');
const Continent = require('../models/neo4j/continent');

const _singleContinentWithDetails = function (record) {
  if (record.length) {
    const result = {};
    let country_arr = [];
    record.forEach(element => {
      let relationship_type = element._fields[0];
      _.extend(result, new Continent(element.get('continent')));
      result.id = element._fields[1].identity.low,
      result.code = element._fields[1].properties.code,
      result.name = element._fields[1].properties.name
      if(relationship_type == 'IN'){
        country_arr.push(element._fields[2]);
      }
      result.COUNTRIES = country_arr;
    })
    
    return result;
  }
  else {
    return null;
  }
};

// return many continents
function _manyContinents(neo4jResult) {
  return neo4jResult.records.map(r => {
    cont = new Continent(r.get('continent'));
    let arr = [];
    arr.push(r.get('b'));
    cont.COUNTRIES = arr;
    return cont;
  });
}

// get a single continent by id
const getById = function (session, id) {
  const query = [
    `MATCH (continent:Continent)-[r]-(b)
    WHERE ID(continent) = ${id}
    RETURN type(r), continent, b`,
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {id: id})
    ).then(result => {
      if (!_.isEmpty(result.records)) {
        return _singleContinentWithDetails(result.records);
      }
      else {
        throw {message: 'continent not found', status: 404}
      }
    });
};

// get all continents
const getAll = function (session) {
  return session.readTransaction(txc =>
      txc.run('MATCH (continent:Continent)-[r]-(b) RETURN r, continent, b LIMIT 500')
    ).then(result =>{
      let res = _manyContinents(result);
      return mergeIds(res);
    });
};

const mergeIds = (list) => {
  const subarrsById = {};
  for (const entry of list) {
    if(!subarrsById[entry.id]){
      if(entry.COUNTRIES){
        subarrsById[entry.id] = { ...entry, COUNTRIES: [...entry.COUNTRIES]};
      }
    } else {
      if(entry.COUNTRIES)
        subarrsById[entry.id].COUNTRIES.push(...entry.COUNTRIES);
    }
  }
  return Object.values(subarrsById);
}


module.exports = {
  getAll: getAll,
  getById: getById
};