const People = require("../models/people"),
  _ = require("lodash"),
  writeResponse = require("../helpers/response").writeResponse,
  dbUtils = require("../neo4j/dbUtils");

/**
 * @swagger
 * definition:
 *   Person:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       affiliation:
 *         type: string
 *       homepage:
 *         type: string
 *       unicode_name:
 *         type: string
 *       notes:
 *         type: string
 */

/**
 * @swagger
 * /api/v0/people:
 *   get:
 *     tags:
 *     - people
 *     description: Returns all people
 *     summary: Returns all people
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of people
 *         schema:
 *           type: array
 */
exports.list = function (req, res, next) {
  People.getAll(dbUtils.getSession(req))
    .then((response) => writeResponse(res, response))
    .catch(next);
};

/**
 * @swagger
 * /api/v0/people/{id}/institutions:
 *  get:
 *    tags:
 *    - people
 *    description: Returns all institutions a person is affiliated with
 *    summary: Returns all institutions a person is affiliated with
 *    produces:
 *    - application/json
 *    parameters:
 *    - name: id
 *     description: Person id
 *    in: path
 *    required: true
 *    type: integer
 *    responses:
 *     200:
 *      description: A list of institutions
 *      schema:
 *      type: array
 *      items:
 *       $ref: '#/definitions/Institution'
 *     400:
 *      description: Error message(s)
 *     404:
 *      description: Person not found
 */

/**
 * @swagger
 * /api/v0/people/{id}:
 *   get:
 *     tags:
 *     - people
 *     description: Returns a person by id
 *     summary: Returns a person by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Person id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A person

 *       400:
 *         description: Error message(s)
 *       404:
 *         description: Person not found
 */
exports.findById = function (req, res, next) {
  const id = req.params.id;
  if (!id) throw { message: "Invalid id", status: 400 };

  People.getById(dbUtils.getSession(req), id)
    .then((response) => writeResponse(res, response))
    .catch(next);
};
