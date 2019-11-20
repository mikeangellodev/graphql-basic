const { MongoClient } = require('mongodb');
const { dbHost, dbPort, dbUser, dbPassword, dbName } = require('../config');

const authMechanism = 'SCRAM-SHA-1';

const url = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/?authMechanism=${authMechanism}&authSource=${dbName}`;

let connection;

const connectDB = async () => {
  if (connection) return connection;

  const client = new MongoClient(url, { useNewUrlParser: true });

  try {
    await client.connect();

    // eslint-disable-next-line require-atomic-updates
    connection = client.db(dbName);
  } catch (error) {
    console.log('Could not connect to DB', url, error);

    throw new Error('Could not connect to DB');
  }

  return connection;
};

module.exports = connectDB;
