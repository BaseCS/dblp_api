const Countries = require('../models/countries')
  , _ = require('lodash')
  , writeResponse = require('../helpers/response').writeResponse
  , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definition:
 *   Country:
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
 * /api/v0/countries:
 *   get:
 *     tags:
 *     - countries
 *     description: Returns all countries
 *     summary: Returns all countries
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of countries
 *         schema:
 *           type: array
 */
exports.list = function (req, res, next) {
  Countries.getAll(dbUtils.getSession(req))
    .then(response => writeResponse(res, response))
    .catch(next);
};


/**
 * @swagger
 * /api/v0/countries/{id}:
 *   get:
 *     tags:
 *     - countries
 *     description: Returns a country by id
 *     summary: Returns a country by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Country id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A country

 *       400:
 *         description: Error message(s)
 *       404:
 *         description: Country not found
 */
exports.findById = function (req, res, next) {
  const id = req.params.id;
  if (!id) throw {message: 'Invalid id', status: 400};

  Countries.getById(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next);
};