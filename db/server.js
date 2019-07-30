const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const { merge } = require("lodash");

const courseTypeDefs = require("./types/course.types");
const courseResolvers = require("./resolvers/course.resolvers");
const userTypeDefs = require("./types/user.types");
const userResolvers = require("./resolvers/user.resolvers");


mongoose.connect("mongodb://localhost/graphql_db_course", {
  useNewUrlParser: true
});

const app = express();

const typeDefs = `
    type Alert {
        message: String
    }

    type Query {
        _: Boolean
      }
    
      type Mutation {
        _: Boolean
      }
`;

const resolvers = {};

const schema = makeExecutableSchema({
  typeDefs: [typeDefs, courseTypeDefs, userTypeDefs],
  resolvers: merge(resolvers, courseResolvers, userResolvers)
});

app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({
    schema: schema
  })
);
app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql"
  })
);

app.listen(4000, () => {
  console.log("server started");
});
