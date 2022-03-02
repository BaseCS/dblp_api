const Prints = require('../models/prints')
  , _ = require('lodash')
  , writeResponse = require('../helpers/response').writeResponse
  , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definition:
 *   Print:
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
 *       number_of_pages:
 *         type: integer
 *       pages:
 *         type: integer
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
 * /api/v0/prints:
 *   get:
 *     tags:
 *     - prints
 *     description: Returns all prints
 *     summary: Returns all prints
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of prints
 *         schema:
 *           type: array
 */
exports.list = function (req, res, next) {
  Prints.getAll(dbUtils.getSession(req))
    .then(response => writeResponse(res, response))
    .catch(next);
};


/**
 * @swagger
 * /api/v0/prints/{id}:
 *   get:
 *     tags:
 *     - prints
 *     description: Returns a print by id
 *     summary: Returns a print by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Print id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A print

 *       400:
 *         description: Error message(s)
 *       404:
 *         description: Print not found
 */
exports.findById = function (req, res, next) {
  const id = req.params.id;
  if (!id) throw {message: 'Invalid id', status: 400};

  Prints.getById(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next);
};