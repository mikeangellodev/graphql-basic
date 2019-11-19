const courses = [
  {
    _id: 'anyId1',
    title: 'My title 1',
    teacher: 'My professor',
    description: 'A description',
    topic: 'programming',
  },
  {
    _id: 'anyId2',
    title: 'My title 2',
    teacher: 'My professor',
    description: 'A description',
    topic: 'programming',
  },
  {
    _id: 'anyId3',
    title: 'My title 3',
    teacher: 'My professor',
    description: 'A description',
    topic: 'programming',
  },
];

const resolvers = {
  Query: {
    getCourses: () => courses,
    getCourse: (_, args) => {
      const course = courses.filter(course => course._id === args.id);

      return course.pop();
    }
  }
};

module.exports = resolvers;
