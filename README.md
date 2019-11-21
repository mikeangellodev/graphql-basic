# GraphQL básico

1. **Introducción**

GraphQL es un nuevo paradigma aplicado a la nueva necesidad que siempre han tenido los desarrolladores de realizar intercambios de información entre diferentes aplicaciones.

Anteriormente existían protocolos como CORBA, SOAP, RPC y el más reciente y utilizado REST. GraphQL creado en el 2015 por Facebook puede ser visto como una evolución al protocolo REST.

Su principal ventaja es la flexibilidad al momento de requerir información, lo que con REST podría tomar varias consultas y peticiones, en un API de GraphQL bien diseñado solo tomara una única llamada.

Ventajas

- Un lenguaje agnóstico que permite definir de una forma clara y simple los objectos y acciones del API
- Una validación automática de la información a ingresar
- Control de errores de una forma uniforme y predecible
- Una documentación mínima autogenerada que permite saber exactamente como debe ser usado el API tanto a la hora de pedir y enviar información
- Un entorno de desarrollo amigable donde se puede probar todas las interacciones

https://graphql.org/

https://www.youtube.com/watch?v=783ccP__No8


2. **Conceptos básicos**

**Schema**

- El Schema es la base de una API en GraphQL, es el encargado de describir todos los tipos de información que va a contener.

**Scalars**

Dentro de GraphQL contamos con distintos tipos de datos escalares:

- String
- Int
- Float
- Boolean
- ID

**Resolvers**

- Una query permite ejecutar una petición al API, dentro de una query se debe indicar la consulta que quieres ejecutar y los campos que deseas obtener. GraphQL te va a devolver la información que solicitaste dentro del objeto data.

- El resultado de tu petición no se va a ejecutar de manera mágica, para ello debes definir el objeto resolvers, este objeto va a contener una propiedad del mismo nombre que la query que va a resolver o ejecutar.

```bash
➜  npx license mit > LICENSE && npx gitignore node && yarn init

➜  yarn add express graphql apollo-server apollo-server-express graphql-import --exact
➜  yarn add mongodb dotenv --exact

➜  yarn add nodemon eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-promise eslint-plugin-node eslint-config-node standard @playlyfe/gql -D --exact

➜  yarn add eslint-config-airbnb eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks and eslint-plugin-jsx-a11y -D --exact
```
- **package.json**

```json
{
  "engines": {
    "node": ">=10.16.3"
  },
  "scripts": {
    "dev": "nodemon -e js,graphql index",
    "lint": "standard",
    "lint-fix": "standard --fix"
  }
}
```

- **.eslintrc.json**

```json
{
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "airbnb",
        // "eslint:recommended",
        "prettier",
        "plugin:prettier/recommended",
        "plugin:promise/recommended",
        "plugin:node/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2020
    },
    "plugins": ["prettier", "promise"],
    "rules": {
        "prettier/prettier": ["error"],
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": "off",
        "no-underscore-dangle": ["error", { "allow": ["_id"] }]
    }
}
```

- **.prettierrc**

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "parser": "flow"
}
```

- **.gqlconfig**

```json
{
  "schema": {
    "files": "lib/schemas/**/*.graphql"
  }
}
```

- **index.js**

```js
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { importSchema } = require('graphql-import');
// Type Defs
const typeDefs = importSchema('./lib/schemas/schema.graphql');
// Resolvers
const resolvers = require('./lib/resolvers');

const app = express();

const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => {
    if (error.extensions.code === 'INTERNAL_SERVER_ERROR') {
      return new Error('A ocurrido un error en el servidor');
    }

    /* if (error.message.startsWith('Database Error: ')) {
      return new Error('Internal server error');
    } */

    /* if (error.originalError instanceof AuthenticationError) {
      return new Error('Different authentication error message!');
    } */

    return error;
  },
});

const port = process.env.PORT || 3000;

graphqlServer.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () => {
  console.log(
    `Server listening at http://127.0.0.1:${port}${graphqlServer.graphqlPath}`,
  );
});
````

- **lib/schemas/schema.graphql**

```graphql
# import Course, CourseInput, CourseEditInput from './courses.graphql'
# import Student, StudentInput, StudentEditInput from './students.graphql'

type Query {
  # Return all courses
  getCourses: [Course]
  # Return a single course
  getCourse(id: ID!): Course
  # Return all students
  getStudents: [Student]
  # Return a single student
  getStudent(id: ID!): Student
}

type Mutation {
  # Create a course
  createCourse(input: CourseInput!): Course
  # Edit a course
  editCourse(id: ID!, input: CourseEditInput!): Course
  # Create a student
  createStudent(input: StudentInput!): Student
  # Create a student
  editStudent(id: ID!, input: StudentEditInput!): Student
  # Add a people to course
  addPeople(courseId: ID!, personId: ID!): Course
}
```
- **lib/schemas/courses.graphql**

```graphql
# import Student from './students.graphql'

type Course {
  _id: ID!
  title: String!
  teacher: String
  description: String!
  topic: String
  people: [Student]
}

input CourseInput {
  title: String!
  teacher: String
  description: String!
  topic: String
}

input CourseEditInput {
  title: String
  teacher: String
  description: String
  topic: String
}
```

- **lib/schemas/students.graphql**

```graphql
type Student {
  _id: ID!
  name: String!
  email: String!
}

input StudentInput {
  name: String!
  email: String!
}

input StudentEditInput {
  name: String
  email: String
}
```

- **lib/resolvers/index.js**

```js
// Queries
const queries = require('./queries');
const mutations = require('./mutations');
const types = require('./types');

const resolvers = {
  Query: queries,
  Mutation: mutations,
  ...types,
};

module.exports = resolvers;
```

- **lib/resolvers/queries.js**

```js
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
  getStudents: async () => {
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
  getStudent: async (_, args) => {
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
};

module.exports = queries;
```

- **lib/resolvers/mutations.js**

```js
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
```

- **lib/resolvers/types.js**

```js
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
```

- **lib/db/index.js**

```js
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

    // eslint-disable-next-line require-atomic-updates
    connection = client.db(dbName);
  } catch (error) {
    console.log('Could not connect to DB', url, error);

    throw new Error('Could not connect to DB');
  }

  return connection;
};

module.exports = connectDB;
```

- **lib/config.js**

```js
const config = {
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
};

module.exports = config;
```

3. **Conceptos avanzados**

- **Aliases and Fragments**

```graphql
query {
  allCourses: getCourses {
    ...CourseFields
  }
  
  Course2: getCourse(id: "5dd498f2e1873b0ef979e39f") {
    ...CourseFields
    teacher
  }
  
  Course4: getCourse(id: "5dd4ab363dd3e61480343906") {
    ...CourseFields
    topic
  }
}

fragment CourseFields on Course {
  _id
  title
  description
  people {
    _id
    name
  }
}
```

- **Variables**

```graphql
mutation onAddPeople($courseId: ID!, $personId: ID!) {
  addPeople(courseId: $courseId, personId: $personId) {
    _id
    title
  }
}

# Variables

{
  "courseId": "",
  "personId": ""
}
```

- **Enums**
	- **lib/schemas/courses.graphql**

```graphql
# import Student from './students.graphql'

enum Level {
  beginner
  intermediate
  advanced
}

type Course {
  _id: ID!
  title: String!
  teacher: String
  description: String!
  topic: String
  people: [Student]
  level: Level
}

input CourseInput {
  title: String!
  teacher: String
  description: String!
  topic: String
  level: Level!
}
```

- **Interfaces**

https://graphql.org/learn/schema/#interfaces

- **lib/schemas/people.graphql**

```graphql
interface Person {
  _id: ID!
  name: String!
  email: String!
}

type Student implements Person {
  _id: ID!
  name: String!
  email: String!
  avatar: String
}

type Monitor implements Person {
  _id: ID!
  name: String!
  email: String!
  phone: String
}

input PersonInput {
  name: String!
  email: String!
  avatar: String
  phone: String
}

input PersonEditInput {
  name: String
  email: String
  avatar: String
  phone: String
}
```

- **lib/schemas/schema.graphql**

```graphql
# import Course, CourseInput, CourseEditInput from './courses.graphql'
# import Person, PersonInput, PersonEditInput from './people.graphql'

type Query {
  # Return all courses
  getCourses: [Course]
  # Return a single course
  getCourse(id: ID!): Course
  # Return all students
  getPeople: [Person]
  # Return a single student
  getPerson(id: ID!): Person
}

type Mutation {
  # Create a course
  createCourse(input: CourseInput!): Course
  # Edit a course
  editCourse(id: ID!, input: CourseEditInput!): Course
  # Create a student
  createPerson(input: PersonInput!): Person
  # Create a Person
  editPerson(id: ID!, input: PersonEditInput!): Person
  # Add a people to course
  addPeople(courseId: ID!, personId: ID!): Course
}
```

- **lib/resolvers/queries.js**

```js
const queries = {
  // ...
  getPeople: async () => {
    // ...
  },
  getPerson: async (_, args) => {
    // ...
  },
};
```

- **lib/resolvers/mutations.js**

```js
const mutations = {
  // ...
  createPerson: async (_, { input }) => {
    // ...
  },
  editPerson: async (_, { id, input }) => {
    // ...
  },
  // ...
};
```

- **lib/resolvers/types.js**

```js
const types = {
  //...
  Person: {
    __resolveType: (person, context, info) => {
      if (person.phone) {
        return 'Monitor';
      }

      return 'Student';
    },
  },
};
```

```graphql
mutation onCreateMonitor($variables: PersonInput!) {
  createPerson(input: $variables) {
    _id
    name
  }
}
```

```graphql
{
  getPeople {
    _id
    name
    email
    ... on Monitor {
      phone
    }
    ... on Student {
      avatar
    }
  }
}
```

- **Directives**

https://graphql.org/learn/queries/#directives

```graphql
query onGetPeople($monitor: Boolean!, $avatar: Boolean!) {
  getPeople {
    _id
    name
    ... on Monitor @include(if: $monitor) {
      phone
    }
    ... on Student @include(if: $avatar) {
      avatar
      email
    }
  }
}
```

- **Union types**

https://graphql.org/learn/schema/#union-types

```json
db.courses.createIndex({ "$**" : "text" })

db.students.createIndex({ "$**" : "text" })
```

- **lib/schemas/schema.graphql**

```graphql
# import Course, CourseInput, CourseEditInput from './courses.graphql'
# import Person, Student, Monitor, PersonInput, PersonEditInput from './people.graphql'

union GlobalSearch = Course | Student | Monitor

type Query {
  # ...

  # Execute a global search
  searchItems(keyword: String!): [GlobalSearch]
}

# ...

```

- **lib/resolvers/types.js**

```js
const types = {
  // ...
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
```

- **lib/resolvers/queries.js**

```js
const queries = {
  // ...
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
```

```graphql
{
  searchItems(keyword: "1") {
    __typename
    ... on Course {
      title
      description
    }
    ... on Monitor {
      name
      phone
    }
    ... on Student {
      name
      email
    }
  }
}
```

4. **Consumiendo el API**

```bash
➜  yarn add cors --exact
```

- **package.json**

```json
{
  //...
  "scripts": {
    "prod": "NODE_ENV=production node index",
    //...
  },
  //...
}

```

- **index.js**

```js
//...
const cors = require('cors');
//...
const isDev = process.env.NODE_ENV !== 'production';

app.use(cors());

const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: isDev,
  playground: isDev,
  //...
});

//...

```
