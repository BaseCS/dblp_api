const Conferences = require('../models/conferences')
  , _ = require('lodash')
  , writeResponse = require('../helpers/response').writeResponse
  , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definition:
 *   Conference:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 */

/**
 * @swagger
 * /api/v0/conferences:
 *   get:
 *     tags:
 *     - conferences
 *     description: Returns all conferences
 *     summary: Returns all conferences
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of conferences
 *         schema:
 *           type: array
 */
exports.list = function (req, res, next) {
  Conferences.getAll(dbUtils.getSession(req))
    .then(response => writeResponse(res, response))
    .catch(next);
};


/**
 * @swagger
 * /api/v0/conferences/{id}:
 *   get:
 *     tags:
 *     - conferences
 *     description: Returns a conference by id
 *     summary: Returns a conference by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Conference id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A conference

 *       400:
 *         description: Error message(s)
 *       404:
 *         description: Conference not found
 */
exports.findById = function (req, res, next) {
  const id = req.params.id;
  if (!id) throw {message: 'Invalid id', status: 400};

  Conferences.getById(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next);
};