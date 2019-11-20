// Queries
const queries = require('./queries');
const mutations = require('./mutations');
const types = require('./types');

const resolvers = {
  Query: queries,
  Mutation: mutations,
  ...types,
};

module.exports = resolvers;
