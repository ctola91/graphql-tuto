const express = require("express");
const { graphql, buildSchema } = require("graphql");
const graphqlHTTP = require("express-graphql");

const courses = require("./courses");

// schema definition language
const schema = buildSchema(`
  type Course {
    id: ID!
    title: String!
    views: Int
  }

  type Query {
    getCourses: [Course]
    getCourse(id: ID!): Course
  }

  type Mutation {
    addCourse(title: String!, views: Int): Course
  }
`);

const root = {
  getCourses: () => courses,
  getCourse: ({ id }) => courses.find(course => course.id === id),
  addCourse({ title, views }) {
    const id = String(courses.length + 1);
    const course = {
      id,
      title,
      views
    };
    courses.push(course);
    return course;
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
