# dblp_api

To run this api, first make sure your neo4j server is running, then:

- clone this repo
- run `npm install
- create .env file in the main dir with the following details:
  ``` 
      DBLP_DATABASE_USERNAME="enteryourusername"
      DBLP_DATABASE_PASSWORD="enteryourpassword"
      DBLP_DATABASE_URL="enteryourlocalhostlink" 
  ```
   
   everyone has their own username, password, and localhost links so just fill that in
   
- once that is done, run `node app.js`
- Then open up `localhost:3000/docs`
- You should see a swagger UI documentation of the API
