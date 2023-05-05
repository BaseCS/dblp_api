const _ = require('lodash');
const Person = require('../models/neo4j/person');

const _singlePersonWithDetails = function (record) {
  if (record.length) {
    const result = {};
    let auth_arr = [];
    record.forEach(element => {
      _.extend(result, new Person(element.get('person')));
      let t = element._fields[0];
      result.id = element._fields[1].identity.low,
      result.name = element._fields[1].properties.name,
      result.homepage = element._fields[1].properties.homepage,
      result.unicode_name = element._fields[1].properties.unicode_name,
      result.affiliation = element._fields[1].properties.affiliation,
      result.notes = element._fields[1].properties.notes
      if(t == 'AUTHORED'){
        auth_arr.push(element._fields[2]);
      } else if(t == 'BELONGS_TO'){
        result.BELONGS_TO = element._fields[2]
      }
      result.AUTHORED = auth_arr;
    })
    return result;
  }
  else {
    return null;
  }
};

// return many people
function _manyPeople(neo4jResult) {
  return neo4jResult.records.map(r => {
    per = new Person(r.get('person'));
    let type = r.get('r').type;
    let arr = [];
    arr.push(r.get('b'));
    per[type] = arr;
    return per;
  });
}

// get a single person by id
const getById = function (session, id) {
  const query = [
    `MATCH (person:Person)-[r]-(b)
    WHERE ID(person) = ${id}
    RETURN type(r), person, b`
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {id: id})
    ).then(result => {
      if (!_.isEmpty(result.records)) {
        return _singlePersonWithDetails(result.records);
      }
      else {
        throw {message: 'person not found', status: 404}
      }
    });
};

// get all people
const getAll = function (session) {
  return session.readTransaction(txc =>
      txc.run('MATCH (person:Person)-[r]-(b) RETURN r, person, b LIMIT 500')
    ).then(result =>{
      let res = _manyPeople(result);
      return mergeIds(res);
    });
};


// get institutions by person id
const getInstitutionsByPersonId = function (session, id) {
  const query = [
    `MATCH (person:Person)-[:BELONGS_TO]->(institution:Institution)`,
    `WHERE ID(person) = ${id}`,
    'RETURN institution',
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {id: id})
    ).then(result => {
      if (!_.isEmpty(result.records)) {
        return _manyInstitutions(result);
      }
      else {
        throw {message: 'person not found', status: 404}
      }
    });
}

const mergeIds = (list) => {
  const subarrsById = {};
  for (const entry of list) {
    if(!subarrsById[entry.id]){
      if(entry.AUTHORED){
        subarrsById[entry.id] = { ...entry, AUTHORED: [...entry.AUTHORED], BELONGS_TO: entry.BELONGS_TO};
      }
    } else {
      if(entry.AUTHORED)
        subarrsById[entry.id].AUTHORED.push(...entry.AUTHORED);
      if(entry.BELONGS_TO)
        subarrsById[entry.id].BELONGS_TO = entry.BELONGS_TO;
    }
  }
  return Object.values(subarrsById);
}

module.exports = {
  getAll: getAll,
  getById: getById,
  getInstitutionsByPersonId: getInstitutionsByPersonId
};