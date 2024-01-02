'use strict';

// Import and configure environment variables from a .env file
require('dotenv').config();

// Import the 'nconf' module for configuration management
var nconf = require('nconf');

// Load configuration settings from various sources
nconf.env(['PORT', 'NODE_ENV']) // Load from environment variables
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
        // Set default configuration values
        'USERNAME': process.env.DBLP_DATABASE_USERNAME,
        'PASSWORD': process.env.DBLP_DATABASE_PASSWORD,
        'neo4j': 'local', // Default neo4j instance
        'neo4j-local': process.env.DBLP_DATABASE_URL || 'neo4j://localhost:7687', // Default neo4j URL
        'base_url': 'http://localhost:8000', // Default base URL
        'api_path': '/api/v0' // Default API path
    });

// Export the 'nconf' configuration object for use in other modules
module.exports = nconf;
