'use strict'

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

// Schema definition
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello: () => "Hello World!!!",
  }
};

const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const port = process.env.PORT || 3000;

graphqlServer.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () => {
  console.log(`Server listening at http://127.0.0.1:${port}${graphqlServer.graphqlPath}`);
})
