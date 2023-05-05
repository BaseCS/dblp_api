const counts = require('../models/counts')
, _ = require('lodash')
, writeResponse = require('../helpers/response').writeResponse
, dbUtils = require('../neo4j/dbUtils');



/**
 * @swagger
 * 
 *  /api/v0/counts:
 *  get:
 *   tags:
 *      - counts
 *      description: Returns all counts
 *      summary: Returns all counts
 *      produces:
 *       - application/json
 *   responses:
 *      200:
 *          description: A list of counts
 *          schema:
 *             type: array
 *             items:
 *               $ref: '#/definitions/Count'
 *      404:
 *         description: Counts not found
 *         schema:
 *         $ref: '#/definitions/Error'
 */
