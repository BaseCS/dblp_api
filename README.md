# DBLP API Documentation

This API is created using Express.js and all the data queried in Cypher comes from the neo4j graph database that can be set up with the instructions in its respective github <a href="https://github.com/BaseCS/dblp">README file</a> or more detailed in a <a href="https://docs.google.com/document/d/1Y05xxUYSq2KJnJAw9xlArkMYp503SRatBzN7OeLsrCk/edit#heading=h.u1ms4ylmgxbl">google doc</a>. 

The setup for this API is described underneath Installation in this README or in the <a href="https://docs.google.com/document/d/1Y05xxUYSq2KJnJAw9xlArkMYp503SRatBzN7OeLsrCk/edit#heading=h.u1ms4ylmgxbl">google doc</a> as well. 

The data in the database is all from https://dblp.org/. 

The API has 10 endpoints: anthologies, conferences, continents, countries, dblps, institutions, journals, papers, people, and prints. We will describe each one, provide their paths for use, and also include instructions on how to add a new endpoint, or modify existing ones. 

## Installation

To run this api, first make sure your neo4j server is running, then:

- clone this repo
- run `npm install`
- create .env file in the main dir with the following details:
  ``` 
      DBLP_DATABASE_USERNAME="enteryourusername"
      DBLP_DATABASE_PASSWORD="enteryourpassword"
      DBLP_DATABASE_URL="enteryourlocalhostlink" 
  ```
   
   everyone has their own username, password, and localhost links so just fill that in
   the localhost link will most likely be `neo4j://localhost:7687`
   
- once that is done, run `node app.js`
- Then open up `localhost:8000/docs`
- You should see a swagger UI documentation of the API

## All Endpoints
> ANTHOLOGIES <br/>

- Possible requests: `GET /api/v0/anthologies`
			 `GET /api/v0/anthologies/{id}`

- Submitting a request to this endpoint will either return a list of published collections of pieces of writing or one singular published collection based on its id. 

> CONFERENCES <br/>

- Possible requests: `GET /api/v0/conferences`
			 `GET /api/v0/conferences/{id}`

 - Submitting a request to this endpoint will either return a list of conferences or one singular conference based on its id. 

> CONTINENTS <br/>

- Possible requests: `GET /api/v0/continents`
			 `GET /api/v0/continents/{id}`

- Submitting a request to this endpoint will either return a list of continents or one singular continent based on its id. 

> COUNTRIES <br/>

- Possible requests: `GET /api/v0/countries`
			 `GET /api/v0/countries/{id}`

- Submitting a request to this endpoint will either return a list of countries or one singular country based on its id.

> DBLPS <br/> 

- Possible requests: `GET /api/v0/dblps`
			 `GET /api/v0/dblps/{id}`

- DBLPS endpoint is different from the others as it encompasses all the data available from dblp. Submitting a request to this endpoint will return a rather large list of several different types of data from the database. When accessed by id, it will return one singular piece of data based on the id presented, it could be the id of a journal and it would return a journal. 

> INSTITUTIONS <br/>

- Possible requests: `GET /api/v0/institutions`
			 `GET /api/v0/institutions/{id}`

- Submitting a request to this endpoint will either return a list of institutions or one singular institution based on its id. 

- THIS ENDPOINT IS NOT LIMITED TO 500 RESULTS SO RUNNING THIS ON SWAGGER WILL TAKE AN INSANE AMOUNT OF TIME - YOU CAN EDIT THIS IN THE getAll FUNCTION IN models/institutions.js


> JOURNALS <br/>

- Possible requests: `GET /api/v0/journals`
			 `GET /api/v0/journals/{id}`

- Submitting a request to this endpoint will either return a list of journals or one singular journal based on its id. 

> PAPERS <br/>

- Possible requests: `GET /api/v0/papers`
			 `GET /api/v0/papers/{id}`

- Submitting a request to this endpoint will either return a list of papers or one singular paper based on its id. 

> PEOPLE <br/>

- Possible requests: `GET /api/v0/people`
			 `GET /api/v0/people/{id}`

- Submitting a request to this endpoint will either return a list of people or one singular person based on its id.

> PRINTS <br/>

- Possible requests: `GET /api/v0/prints`
			 `GET /api/v0/prints/{id}`

- Submitting a request to this endpoint will either return a list of prints or one singular print based on its id. 

## How the API code works

When you first clone the repository, you will see that there are several folders, and it may be confusing as to which ones are relevant in adding endpoints and using the API, but not to worry, hopefully the information below will help you out with that!

The folders we’re going to worry about when it comes to adding/modifying any endpoints in the root directory are `models/` and `routes/` as well as the `app.js` file. 

In the `models/` folder, we have another folder called `neo4j/`, this is where we can view our 10 different endpoints that we have and the properties we would like our API to return upon a request being sent. In each .js file, we create a const object of the data we are going to return. These files allow us to stay more organized and compartmentalize the endpoints so they do not become mixed/confusing. 

Outside of the `neo4j/` folder, we have 10 js files for each endpoint there as well, except this is where almost all of the work is being done in gathering the data. In each .js file, we are getting the const object we created in the `neo4j/` folder and using that to return new instances of our data. We have two main functions in the .js file, `getById` and `getAll`. 

- `getById` uses the following Cypher query (using the Anthology as an example):

   ```
   MATCH (anthology:Anthology) WHERE ID(anthology) = ${id},
    RETURN anthology
    ```
This passes in the ID that the user sent and finds its matching node in the graph database, and returns it

Upon the database returning a result, we call `_singleAnthologyWithDetails` by passing in the result, and that function returns an instance of the const object we created with each property being assigned its respective piece of data 

- `getAll` works in a similar manner, it uses the following Cypher query (using the Anthology as an example):
```
MATCH (anthology:Anthology) RETURN anthology LIMIT 100
```

This retrieves all nodes of type Anthology and returns them, however, only limiting the result to 100 nodes as we have a lot of data and if we were to return all of it in our Swagger App, then it would take a long time to retrieve it

All the endpoints in the API are limited by a certain number of nodes, besides the Institutions, we are returning all the nodes for Institutions so that we can retrieve all of them in our front end - and eventually this limit will need to be removed for all endpoints 

Upon the database returning a result of all nodes, we call `_manyAnthologies`, which will format each node to return an instance of the const object created, and eventually a list of them all

In our Anthology example, we do not deal with relationships of nodes, however, we will eventually have to change that for all of these nodes, for now, only the Institutions, People, Countries, and Continents endpoints have been changed to included information about how they are related to other nodes.

To deal with relationships, the `getById` and `getAll` functions look a little different:

- `getById` uses the following Cypher query (using the Institutions as an example):
    ```
    MATCH (a)-[r]-(institution:Institution)
   	WHERE ID(institution) = ${id}
   	RETURN institution, a, type(r)
    ```
    
This passes in the ID that the user sent, finds its matching node, as well as any relationships it has in the graph database, and returns the node, its related node, and the type of relationship it has to that related node
Upon the database returning a result, we call `_singleInstitutionWithDetails` by passing in the result, and that function returns an instance of the const object we created with each property being assigned its respective piece of data 

`getAll` works in a similar manner, it uses the following Cypher query (using the Institutions as an example):

```
MATCH (a)-[r]-(institution:Institution) RETURN a, r, institution
```

This retrieves all related nodes, the types of relationships, the Institution nodes itself and returns them

Upon the database returning a result of all nodes, we call `_manyInstitutions`, which will format each node to return an instance of the const object created, merge those nodes with the same ID, and eventually a list of them all

All the `getAll` functions have a `LIMIT 500` or `LIMIT 100` (except of institutions.js) at the end of the Cypher query to limit the amount of data being returned, you can change this as you would like, if you do remove the limit like in `institutions.js`, when you test it in swagger, it will take a very long time to load, and may not work since there is billions of nodes and relationships in the dataset. 

Taking in all the information above, you can modify the endpoints as needed, whether it is through the Cypher queries or the way the data is being processed upon returning a response from the database. 

## How to add a new endpoint

To add a new endpoint, there are only a few steps to follow:
Create a .js file in `models/neo4j`
- to follow style choices made, try to name it the singular version of the endpoint you are creating, for instance, if you want an endpoint for getting data about dogs, name it dog.js, format it like below:
```
// extracts just the data from the query results
 
const _ = require('lodash');
 
const Dog = module.exports = function (_node) {
 _.extend(this, _node.properties);
 this.id = _node.identity.low;
 this.name = this.name;
 this.owner = this.owner;
};
```

Create a .js file in `models/`
 - to follow style choices made, try to name it plural version of the endpoint you are creating, for instance, if you want an endpoint for getting data about dogs, name it `dogs.js`
 - This file can be formatted by copying any other .js files and modifying the Cypher queries as well as any other changes needed to fit for your data. 

All the endpoints are documented using Swagger, to update them or add new documentation, you can add a new .js file in the `routes/` folder. 

Create a .js file in the `routes/` folder
- to follow style choices made, try to name it plural version of the endpoint you are creating, for instance, if you want to document an endpoint for getting data about dogs, name it `dogs.js`
- This file can be formatted by copying any other .js files in this folder and modifying the definitions and import statements as fit for the data 

