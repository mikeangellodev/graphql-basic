const connectDB = require('./../db');

const types = {
  Course: {
    people: async ({ people }) => {
      let data = [];

      try {
        if (people && people.length > 0) {
          const db = await connectDB();

          data = await db
            .collection('students')
            .find({ _id: { $in: people } })
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
