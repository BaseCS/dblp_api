const Anthologies = require('../models/anthologies')
  , _ = require('lodash')
  , writeResponse = require('../helpers/response').writeResponse
  , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definition:
 *   Anthology:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       DBLP_type:
 *         type: string
 *       electronic_edition:
 *         type: string
 *       isbn:
 *         type: string
 *       publisher:
 *         type: string
 *       series:
 *         type: string
 *       title:
 *         type: string
 *       year:
 *         type: string
 */

/**
 * @swagger
 * /api/v0/anthologies:
 *   get:
 *     tags:
 *     - anthologies
 *     description: Returns all anthologies
 *     summary: Returns all anthologies
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of anthologies
 *         schema:
 *           type: array
 */
exports.list = function (req, res, next) {
  Anthologies.getAll(dbUtils.getSession(req))
    .then(response => writeResponse(res, response))
    .catch(next);
};


/**
 * @swagger
 * /api/v0/anthologies/{id}:
 *   get:
 *     tags:
 *     - anthologies
 *     description: Returns an anthology by id
 *     summary: Returns an anthology by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Anthology id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: An anthology

 *       400:
 *         description: Error message(s)
 *       404:
 *         description: Anthology not found
 */
exports.findById = function (req, res, next) {
  const id = req.params.id;
  if (!id) throw {message: 'Invalid id', status: 400};

  Anthologies.getById(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next);
};