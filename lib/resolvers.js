const courses = [
  {
    _id: 'anyId',
    title: 'My title 1',
    teacher: 'My professor',
    description: 'A description',
    topic: 'programming',
  },
  {
    _id: 'anyId',
    title: 'My title 2',
    teacher: 'My professor',
    description: 'A description',
    topic: 'programming',
  },
  {
    _id: 'anyId',
    title: 'My title 3',
    teacher: 'My professor',
    description: 'A description',
    topic: 'programming',
  },
];

const resolvers = {
  Query: {
    getCourses: () => courses
  }
};

module.exports = resolvers;
