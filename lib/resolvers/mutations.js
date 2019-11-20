const connectDB = require('./../db');

const mutations = {
  createCourse: async (_, { input }) => {
    let course = null;
    const defaultDocument = {
      teacher: '',
      topic: '',
    };

    try {
      const db = await connectDB();
      course = Object.assign(defaultDocument, input);
      const result = await db.collection('courses').insertOne(course);

      course._id = result.insertedId;
    } catch (error) {
      console.error(error);
    }

    return course;
  }
};

module.exports = mutations;
