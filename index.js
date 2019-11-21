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
  formatError: error => {
    if (error.extensions.code === 'INTERNAL_SERVER_ERROR') {
      console.error(error);

      return new Error('A ocurrido un error en el servidor');
    }

    /* if (error.message.startsWith('Database Error: ')) {
      return new Error('Internal server error');
    } */

    /* if (error.originalError instanceof AuthenticationError) {
      return new Error('Different authentication error message!');
    } */

    return error;
  },
});

const port = process.env.PORT || 3000;

graphqlServer.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () => {
  console.log(
    `Server listening at http://127.0.0.1:${port}${graphqlServer.graphqlPath}`,
  );
});
