'use strict';

require('dotenv').config();

var nconf = require('nconf');

nconf.env(['PORT', 'NODE_ENV'])
  .argv({
    'e': {
      alias: 'NODE_ENV',
      describe: 'Set production or development mode.',
      demand: false,
      default: 'development'
    },
    'p': {
      alias: 'PORT',
      describe: 'Port to run on.',
      demand: false,
      default: 8000
    },
    'n': {
      alias: "neo4j",
      describe: "Use local or remote neo4j instance",
      demand: false,
      default: "local"
    }
  })
  .defaults({
    'USERNAME': process.env.DBLP_DATABASE_USERNAME,
    'PASSWORD' : process.env.DBLP_DATABASE_PASSWORD,
    'neo4j': 'local',
    'neo4j-local': process.env.DBLP_DATABASE_URL || 'neo4j://localhost:7687',
    'base_url': 'http://localhost:8000',
    'api_path': '/api/v0'
  });

module.exports = nconf;