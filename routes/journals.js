const Journals = require('../models/journals')
  , _ = require('lodash')
  , writeResponse = require('../helpers/response').writeResponse
  , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definition:
 *   Journal:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 */

/**
 * @swagger
 * /api/v0/journals:
 *   get:
 *     tags:
 *     - journals
 *     description: Returns all journals
 *     summary: Returns all journals
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of journals
 *         schema:
 *           type: array
 */
exports.list = function (req, res, next) {
  Journals.getAll(dbUtils.getSession(req))
    .then(response => writeResponse(res, response))
    .catch(next);
};


/**
 * @swagger
 * /api/v0/journals/{id}:
 *   get:
 *     tags:
 *     - journals
 *     description: Returns a journal by id
 *     summary: Returns a journal by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Journal id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A journal

 *       400:
 *         description: Error message(s)
 *       404:
 *         description: Journal not found
 */
exports.findById = function (req, res, next) {
  const id = req.params.id;
  if (!id) throw {message: 'Invalid id', status: 400};

  Journals.getById(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next);
};