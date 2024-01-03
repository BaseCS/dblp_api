const DBLPS = require("../models/dblps"),
  _ = require("lodash"),
  writeResponse = require("../helpers/response").writeResponse,
  dbUtils = require("../neo4j/dbUtils");

/**
 * @swagger
 * definition:
 *   DBLP:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 */

/**
 * @swagger
 * /api/v0/dblps:
 *   get:
 *     tags:
 *     - dblps
 *     description: Returns all dblps
 *     summary: Returns all dblps
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of dblps
 *         schema:
 *           type: array
 */
exports.list = function (req, res, next) {
  DBLPS.getAll(dbUtils.getSession(req))
    .then((response) => writeResponse(res, response))
    .catch(next);
};

/**
 * @swagger
 * /api/v0/dblps/{id}:
 *   get:
 *     tags:
 *     - dblps
 *     description: Returns a dblp by id
 *     summary: Returns a dblp by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: DBLP id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A dblp

 *       400:
 *         description: Error message(s)
 *       404:
 *         description: DBLP not found
 */
exports.findById = function (req, res, next) {
  const id = req.params.id;
  if (!id) throw { message: "Invalid id", status: 400 };

  DBLPS.getById(dbUtils.getSession(req), id)
    .then((response) => writeResponse(res, response))
    .catch(next);
};
