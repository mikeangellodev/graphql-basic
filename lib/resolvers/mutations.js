const { ObjectID } = require('mongodb');
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
  },
  editCourse: async (_, { id, input }) => {
    let course = null;

    try {
      const db = await connectDB();
      await db
        .collection('courses')
        .updateOne({ _id: ObjectID(id) }, { $set: input });

      course = await db.collection('courses').findOne({ _id: ObjectID(id) });
    } catch (error) {
      console.error(error);
    }

    return course;
  },
  createStudent: async (_, { input }) => {
    let student = null;

    try {
      const db = await connectDB();
      student = input;
      const result = await db.collection('students').insertOne(student);

      student._id = result.insertedId;
    } catch (error) {
      console.error(error);
    }

    return student;
  },
  editStudent: async (_, { id, input }) => {
    let student = null;

    try {
      const db = await connectDB();
      await db
        .collection('students')
        .updateOne({ _id: ObjectID(id) }, { $set: input });

      student = await db.collection('students').findOne({ _id: ObjectID(id) });
    } catch (error) {
      console.error(error);
    }

    return student;
  },
  addPeople: async (_, { courseId, personId }) => {
    let course = null;
    let person = null;

    try {
      const db = await connectDB();

      course = await db
        .collection('courses')
        .findOne({ _id: ObjectID(courseId) });
      person = await db
        .collection('students')
        .findOne({ _id: ObjectID(personId) });

      if (course && person) {
        await db
          .collection('courses')
          .updateOne(
            { _id: ObjectID(courseId) },
            { $addToSet: { people: ObjectID(personId) } },
          );
      } else {
        throw new Error('Person or Course does not exists.');
      }
    } catch (error) {
      console.error(error);
    }

    return course;
  },
};

module.exports = mutations;
