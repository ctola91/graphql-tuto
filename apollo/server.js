const { ApolloServer } = require("apollo-server");
const { makeExecutableSchema } = require("graphql-tools");

const courses = require("./courses");

const typeDefs = `
  type Course {
    id: ID!
    title: String!
    views: Int
  }
  type Alert {
      message: String
  }
  input CourseInput {
    title: String!,
    views: Int
  }

  type Query {
    getCourses(page: Int, limit: Int = 1): [Course]
  }

  type Mutation {
    addCourse(input: CourseInput): Course
    updateCourse(id: ID!, input: CourseInput): Course,
    deleteCourse(id: ID!): Alert
  }
`;

const resolvers = {
  Query: {
    getCourses(obj, { page, limit }) {
      if (page !== undefined) {
        return courses.slice(page * limit, (page + 1) * limit);
      }
      return courses;
    }
  },
  Mutation: {
    addCourse(obj, { input }) {
      const id = String(courses.length + 1);
      const course = {
        id,
        ...input
      };
      courses.push(course);
      return course;
    },
    updateCourse(obj, { id, input }) {
      const courseIndex = courses.findIndex(course => course.id === id);
      const course = courses[courseIndex];

      const newCourse = Object.assign(course, input);
      return newCourse;
    },
    deleteCourse(obj, { id }) {
      courses = courses.filter(course => course.id !== id);
      return {
        message: `Course with id: ${id} was deleted`
      };
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
});

const server = new ApolloServer({
  schema: schema
});

server.listen().then(({ url }) => {
  console.log(`Servidor iniciado en ${url}`);
});
