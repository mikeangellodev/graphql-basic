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
  Person: {
    __resolveType: (person, context, info) => {
      if (person.phone) {
        return 'Monitor';
      }

      return 'Student';
    },
  },
  GlobalSearch: {
    __resolveType: (item, context, info) => {
      if (item.title) {
        return 'Course';
      }

      if (item.phone) {
        return 'Monitor';
      }

      return 'Student';
    },
  },
};

module.exports = types;
