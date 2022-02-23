// const express = require('express');
// const neo4j = require("neo4j-driver");

// const app = express();
// const port = 3000;

// var driver = neo4j.driver('neo4j://localhost', neo4j.auth.basic('neo4j','basecspassword'));
// var session = driver.session();
// app.get('/', (req, res) => {
//     session
//         .run('MATCH(n:Person) RETURN n LIMIT 50')
//         .then(function(result){
//             var personArr = [];
//             result.records.forEach(function(record) {
//                 personArr.push({
//                     id: record._fields[0].identity.low,
//                     name: record._fields[0].properties.name,
//                     affiliation: record._fields[0].properties.affiliation,
//                     homepage: record._fields[0].properties.homepage,
//                     unicode_name: record._fields[0].properties.unicode_name,
//                     notes: record._fields[0].properties.notes
//                 })
//                 // console.log(record._fields[0].properties)
//             });
//             console.log(personArr);
//         })
//         .catch(function(err){
//             console.log(err)
//         });

//         res.send("data")

// });

// app.listen(port, () => console.log(`API app listening on port ${port}!`))

require("dotenv").config();

var express = require("express"),
  path = require("path"),
  router = (global.router = (express.Router())),
  // routes = require("./routes"),
  nconf = require("./config"),
  swaggerJSDoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express"),
  methodOverride = require("method-override"),
  errorHandler = require("errorhandler"),
//   bodyParser = require("body-parser"),
//   setAuthUser = require("./middlewares/setAuthUser"),
//   neo4jSessionCleanup = require("./middlewares/neo4jSessionCleanup"),
  writeError = require("./helpers/response").writeError;

var app = express(),
  api = express();

app.use(nconf.get("api_path"), api);

var swaggerDefinition = {
  info: {
    title: "Neo4j DBLP Demo API (Node/Express)",
    version: "1.0.0",
    description: "",
  },
  host: "localhost:3000",
  basePath: "/",
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ["./routes/*.js"],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// serve swagger
// api.get("/swagger.json", function (req, res) {
//   res.setHeader("Content-Type", "application/json");
//   res.send(swaggerSpec);
// });

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.set("port", nconf.get("PORT"));

// api.use(bodyParser.json());
api.use(methodOverride());

//enable CORS
api.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//api custom middlewares:
// api.use(setAuthUser);
// api.use(neo4jSessionCleanup);

//api routes
// api.post("/register", routes.users.register);
// api.post("/login", routes.users.login);
// api.get("/users/me", routes.users.me);
// api.get("/movies", routes.movies.list);
// api.get("/movies/recommended", routes.movies.getRecommendedMovies);
// api.get("/movies/rated", routes.movies.findMoviesRatedByMe);
// api.get("/movies/:id", routes.movies.findById);
// api.get("/movies/genre/:id", routes.movies.findByGenre);
// api.get("/movies/daterange/:start/:end", routes.movies.findMoviesByDateRange);
// api.get("/movies/directed_by/:id", routes.movies.findMoviesByDirector);
// api.get("/movies/acted_in_by/:id", routes.movies.findMoviesByActor);
// api.get("/movies/written_by/:id", routes.movies.findMoviesByWriter);
// api.post("/movies/:id/rate", routes.movies.rateMovie);
// api.delete("/movies/:id/rate", routes.movies.deleteMovieRating);
api.get("/people", require('./routes/people').list);
api.get("/people/:id", require('./routes/people').findById);
// api.get("/people/bacon", routes.people.getBaconPeople);
// api.get("/genres", routes.genres.list);

//api error handler
api.use(function (err, req, res, next) {
  if (err && err.status) {
    writeError(res, err);
  } else next(err);
});

app.listen(app.get("port"), () => {
  console.log(
    "Express server listening on port " + app.get("port") + " see docs at /docs"
  );
});

