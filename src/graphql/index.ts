import { ApolloServer } from "@apollo/server";
import { config } from "./config";

const createServer = () => {
  const server = new ApolloServer({
    typeDefs: `
    ${config.typedefs}
    type Query {
      ${config.queries}
    }
    `,
    resolvers: {
      Query: {
        ...config.resolvers.queries,
      },
      ...config.resolvers.nestedQueries,
    },
  });
  return server;
};

export default createServer;
