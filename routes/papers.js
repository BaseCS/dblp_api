const Papers = require('../models/papers')
  , _ = require('lodash')
  , writeResponse = require('../helpers/response').writeResponse
  , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definition:
 *   Paper:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       DBLP_type:
 *         type: string
 *       electronic_edition:
 *         type: string
 *       notes:
 *         type: string
 *       source:
 *         type: string
 *       url:
 *         type: string
 *       title:
 *         type: string
 *       year:
 *         type: string
 *       volume:
 *         type: string
 */

/**
 * @swagger
 * /api/v0/papers:
 *   get:
 *     tags:
 *     - papers
 *     description: Returns all papers
 *     summary: Returns all papers
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of papers
 *         schema:
 *           type: array
 */
exports.list = function (req, res, next) {
  Papers.getAll(dbUtils.getSession(req))
    .then(response => writeResponse(res, response))
    .catch(next);
};


/**
 * @swagger
 * /api/v0/papers/{id}:
 *   get:
 *     tags:
 *     - papers
 *     description: Returns a paper by id
 *     summary: Returns a paper by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Paper id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A paper

 *       400:
 *         description: Error message(s)
 *       404:
 *         description: Paper not found
 */
exports.findById = function (req, res, next) {
  const id = req.params.id;
  if (!id) throw {message: 'Invalid id', status: 400};

  Papers.getById(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next);
};