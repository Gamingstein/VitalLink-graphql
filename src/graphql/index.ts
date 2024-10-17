import { ApolloServer } from "@apollo/server";

const createServer = () => {
  const server = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
      }
    `,
    resolvers: {
      Query: {
        hello: () => "Hello, world!",
      },
    },
  });
  return server;
};

export default createServer;
