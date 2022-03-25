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
  host: "localhost:8000",
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
api.get("/anthologies", require('./routes/anthologies').list);
api.get("/anthologies/:id", require('./routes/anthologies').findById);

api.get("/conferences/", require('./routes/conferences').list);
api.get("/conferences/:id", require('./routes/conferences').findById);

api.get("/continents/", require('./routes/continents').list);
api.get("/continents/:id", require('./routes/continents').findById);

api.get("/countries", require('./routes/countries').list);
api.get("/countries/:id", require('./routes/countries').findById);

api.get("/dblps/", require('./routes/dblps').list);
api.get("/dblps/:id", require('./routes/dblps').findById);

api.get("/institutions/", require('./routes/institutions').list);
api.get("/institutions/:id", require('./routes/institutions').findById);

api.get("/journals/", require('./routes/journals').list);
api.get("/journals/:id", require('./routes/journals').findById);

api.get("/papers", require('./routes/papers').list);
api.get("/papers/:id", require('./routes/papers').findById);

api.get("/people/", require('./routes/people').list);
api.get("/people/:id", require('./routes/people').findById);

api.get("/prints/", require('./routes/prints').list);
api.get("/prints/:id", require('./routes/prints').findById);

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

