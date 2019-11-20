require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { importSchema } = require('graphql-import');
// Type Defs
const typeDefs = importSchema('./lib/schemas/schema.graphql');
// Resolvers
const resolvers = require('./lib/resolvers');

const app = express();

const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const port = process.env.PORT || 3000;

graphqlServer.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () => {
  console.log(
    `Server listening at http://127.0.0.1:${port}${graphqlServer.graphqlPath}`,
  );
});
