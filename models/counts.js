// Import the lodash library and the Institution module
const _ = require("lodash");
const Institution = require("../models/neo4j/institution");

// Function to get paper counts by institution for a given list of conference IDs
const getCountsByInstitution = function (session, ids) {
  // Construct a Neo4j query to find paper counts by institution for specified conference IDs
  const query = [
    "MATCH (institution:Institution)-[:AFFILIATED_WITH]->(author:Author)-[:WROTE]->(paper:Paper)-[:PRESENTED_IN]->(conference:Conference)",
    `WHERE ID(conference) IN [${ids.join(",")}]`,
    "RETURN institution.id as institutionId, count(distinct paper) as paperCount",
    "ORDER BY paperCount DESC",
  ].join("\n");

  // Execute the query in a Neo4j session
  return session
    .readTransaction((txc) => txc.run(query))
    .then((result) => {
      // Initialize an object to store institution paper counts
      const counts = {};

      // Process the query result records
      result.records.forEach((record) => {
        const institutionId = record.get("institutionId");
        const paperCount = record.get("paperCount");

        // Aggregate paper counts for each institution
        if (!counts[institutionId]) {
          counts[institutionId] = paperCount;
        } else {
          counts[institutionId] += paperCount;
        }
      });

      // Sort the institution paper counts in descending order
      const sortedCounts = _.chain(counts)
        .map((count, institutionId) => ({
          institutionId: institutionId,
          count: count,
        }))
        .orderBy("count", "desc")
        .value();

      // Map the sorted counts to institution objects with rankings
      return _.map(sortedCounts, (count) => {
        const institution = new Institution({ _id: count.institutionId });
        return {
          institution: institution,
          count: count.count,
          ranking:
            _.findIndex(sortedCounts, { institutionId: count.institutionId }) +
            1,
        };
      });
    });
};

// Function to get paper counts by institution and handle HTTP request/response
const getCounts = function (req, res, next) {
  const ids = req.query.ids.split(",");

  // Retrieve all institutions from the database
  Institution.getAll(req.driver.session())
    .then((institutions) => {
      return getCountsByInstitution(req.driver.session(), ids).then(
        (counts) => {
          // Group the counts by institution ID
          const countsByInstitution = _.groupBy(
            counts,
            (count) => count.institution.id
          );

          // Create an array of institution counts including rankings
          const institutionCounts = _.map(institutions, (institution) => {
            const counts = countsByInstitution[institution._id];
            if (!counts) {
              // Handle cases where no counts are available
              return { institution: institution, count: 0, ranking: "-" };
            } else {
              return counts[0];
            }
          });

          // Send the institution counts as an HTTP response
          res.send(institutionCounts);
        }
      );
    })
    .catch(next);
};

// Export the getCounts function to be used in other parts of the application
module.exports = {
  getCounts: getCounts,
};
