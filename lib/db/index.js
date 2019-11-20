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

    connection = client.db(dbName);
  } catch (error) {
    console.log('Could not connect to DB', url, error);

    process.exit(1);
  }

  return connection;
};

module.exports = connectDB;
