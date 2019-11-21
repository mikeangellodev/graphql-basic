const { ObjectID } = require('mongodb');
const connectDB = require('./../db');

const queries = {
  getCourses: async () => {
    let courses = [];

    try {
      const db = await connectDB();
      courses = await db
        .collection('courses')
        .find()
        .toArray();
    } catch (error) {
      console.log(error);
    }

    return courses;
  },
  getCourse: async (_, args) => {
    let course = null;

    try {
      const db = await connectDB();
      course = await db
        .collection('courses')
        .findOne({ _id: ObjectID(args.id) });
    } catch (error) {
      console.log(error);
    }

    return course;
  },
  getPeople: async () => {
    let students = [];

    try {
      const db = await connectDB();
      students = await db
        .collection('students')
        .find()
        .toArray();
    } catch (error) {
      console.log(error);
    }

    return students;
  },
  getPerson: async (_, args) => {
    let student = null;

    try {
      const db = await connectDB();
      student = await db
        .collection('students')
        .findOne({ _id: ObjectID(args.id) });
    } catch (error) {
      console.log(error);
    }

    return student;
  },
  searchItems: async (_, { keyword }) => {
    let items = [];

    try {
      const db = await connectDB();
      const courses = await db
        .collection('courses')
        .find({ $text: { $search: keyword } })
        .toArray();

      const people = await db
        .collection('students')
        .find({ $text: { $search: keyword } })
        .toArray();

      items = [...courses, ...people];
    } catch (error) {
      console.log(error);
    }

    return items;
  },
};

module.exports = queries;
