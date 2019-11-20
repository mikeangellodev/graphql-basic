const { ObjectID } = require('mongodb');
const connectDB = require('./db');

const resolvers = {
  Query: {
    getCourses: async () => {
      let courses = [];
      
      try {
        const db = await connectDB();
        courses = await db.collection('courses').find().toArray();
      } catch (error) {
        console.log(error);
      }

      return courses;
    },
    getCourse: async (_, args) => {
      let course = null;
      
      try {
        const db = await connectDB();
        course = await db.collection('courses').findOne({ _id: ObjectID(args.id) });
      } catch (error) {
        console.log(error);
      }

      return course;
    }
  }
};

module.exports = resolvers;
