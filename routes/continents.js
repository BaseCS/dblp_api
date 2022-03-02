const Continents = require('../models/continents')
  , _ = require('lodash')
  , writeResponse = require('../helpers/response').writeResponse
  , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definition:
 *   Continent:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       code:
 *         type: string
 *       name:
 *         type: string
 */

/**
 * @swagger
 * /api/v0/continents:
 *   get:
 *     tags:
 *     - continents
 *     description: Returns all continents
 *     summary: Returns all continents
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of continents
 *         schema:
 *           type: array
 */
exports.list = function (req, res, next) {
  Continents.getAll(dbUtils.getSession(req))
    .then(response => writeResponse(res, response))
    .catch(next);
};


/**
 * @swagger
 * /api/v0/continents/{id}:
 *   get:
 *     tags:
 *     - continents
 *     description: Returns a continent by id
 *     summary: Returns a continent by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Continent id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A continent

 *       400:
 *         description: Error message(s)
 *       404:
 *         description: Continent not found
 */
exports.findById = function (req, res, next) {
  const id = req.params.id;
  if (!id) throw {message: 'Invalid id', status: 400};

  Continents.getById(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next);
};