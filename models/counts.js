const _ = require('lodash');
const Institution = require('../models/neo4j/institution');

const getCountsByInstitution = function (session, ids) {
  const query = [
    'MATCH (institution:Institution)-[:AFFILIATED_WITH]->(author:Author)-[:WROTE]->(paper:Paper)-[:PRESENTED_IN]->(conference:Conference)',
    `WHERE ID(conference) IN [${ids.join(',')}]`,
    'RETURN institution.id as institutionId, count(distinct paper) as paperCount',
    'ORDER BY paperCount DESC'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query)
    ).then(result => {
      const counts = {};
      result.records.forEach(record => {
        const institutionId = record.get('institutionId');
        const paperCount = record.get('paperCount');
        if (!counts[institutionId]) {
          counts[institutionId] = paperCount;
        } else {
          counts[institutionId] += paperCount;
        }
      });

      const sortedCounts = _.chain(counts)
        .map((count, institutionId) => ({institutionId: institutionId, count: count}))
        .orderBy('count', 'desc')
        .value();

      return _.map(sortedCounts, count => {
        const institution = new Institution({_id: count.institutionId});
        return {
          institution: institution,
          count: count.count,
          ranking: _.findIndex(sortedCounts, {institutionId: count.institutionId}) + 1
        };
      });
    });
};

const getCounts = function (req, res, next) {
  const ids = req.query.ids.split(',');
  Institution.getAll(req.driver.session()).then(institutions => {
    return getCountsByInstitution(req.driver.session(), ids).then(counts => {
      const countsByInstitution = _.groupBy(counts, count => count.institution.id);
      const institutionCounts = _.map(institutions, institution => {
        const counts = countsByInstitution[institution._id];
        if (!counts) {
          return {institution: institution, count: 0, ranking: '-'};
        } else {
          return counts[0];
        }
      });
      res.send(institutionCounts);
    });
  }).catch(next);
};

module.exports = {
  getCounts: getCounts
};
