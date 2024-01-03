const Institutions = require("../models/institutions"),
  _ = require("lodash"),
  writeResponse = require("../helpers/response").writeResponse,
  dbUtils = require("../neo4j/dbUtils");

/**
 * @swagger
 * definition:
 *   Institution:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       is_uni:
 *         type: string
 */

/**
 * @swagger
 * /api/v0/institutions:
 *   get:
 *     tags:
 *     - institutions
 *     description: Returns all institutions
 *     summary: Returns all institutions
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of institutions
 *         schema:
 *           type: array
 */
exports.list = function (req, res, next) {
  Institutions.getAll(dbUtils.getSession(req))
    .then((response) => writeResponse(res, response))
    .catch(next);
};

/**
 * @swagger
 * /api/v0/institutions/{id}:
 *   get:
 *     tags:
 *     - institutions
 *     description: Returns an institution by id
 *     summary: Returns an institution by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Institution id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: An institution

 *       400:
 *         description: Error message(s)
 *       404:
 *         description: Institution not found
 */
exports.findById = function (req, res, next) {
  const id = req.params.id;
  if (!id) throw { message: "Invalid id", status: 400 };

  Institutions.getById(dbUtils.getSession(req), id)
    .then((response) => writeResponse(res, response))
    .catch(next);
};
