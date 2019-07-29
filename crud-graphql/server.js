const express = require("express");
const { graphql, buildSchema } = require("graphql");
const graphqlHTTP = require("express-graphql");

let courses = require("./courses");

// schema definition language
const schema = buildSchema(`
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
    getCourses: [Course]
    getCourse(id: ID!): Course
  }

  type Mutation {
    addCourse(input: CourseInput): Course
    updateCourse(id: ID!, input: CourseInput): Course,
    deleteCourse(id: ID!): Alert
  }
`);

const root = {
  getCourses: () => courses,
  getCourse: ({ id }) => courses.find(course => course.id === id),
  addCourse({ input }) {
    const id = String(courses.length + 1);
    const course = {
      id,
      ...input
    };
    courses.push(course);
    return course;
  },
  updateCourse({ id, input }) {
    const courseIndex = courses.findIndex(course => course.id === id);
    const course = courses[courseIndex];

    const newCourse = Object.assign(course, input);
    return newCourse;
  },
  deleteCourse({id}) {
    courses = courses.filter(course => course.id !== id);
    return  {
        message: `Course with id: ${id} was deleted`
    }
  }
};

const app = express();

// middleware
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.get("/", (req, res) => {
  res.send(courses);
});

app.listen(8080, function() {
  console.log("server started");
});
