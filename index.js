'use strict'

const { graphql, buildSchema } = require('graphql');

// Schema definition
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Resolvers
const resolvers = {
  hello: () => {
    return 'Hello World!!!';
  }
}

// Query execution
graphql(schema, '{ hello }', resolvers).then(data => {
  console.log(data)
});
