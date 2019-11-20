const { ObjectID } = require('mongodb');
const connectDB = require('./../db');

const types = {
  Course: {
    people: async ({ people }) => {
      let data = [];
      const ids = people ? people.map(id => ObjectID(id)) : [];

      try {
        if (ids.length > 0) {
          const db = await connectDB();

          data = await db
            .collection('courses')
            .find({ _id: { $in: ids } })
            .toArray();
        }
      } catch (error) {
        console.error(error);
      }

      return data;
    },
  },
};

module.exports = types;
