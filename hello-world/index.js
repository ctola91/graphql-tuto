const express = require('express');
const {GraphQLSchema, GraphQLObjectType, GraphQLString, graphql} = require('graphql');

const app = express();

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            message: {
                type: GraphQLString,
                resolve() {
                    return 'Hello World';
                }
            }
        }
    })
})

app.get('/', function (req, res) {
    graphql(schema, `{ message }`).then(r => res.json(r)).catch(res.json);
});

app.listen(8080, function () {
    console.log('server started');
})