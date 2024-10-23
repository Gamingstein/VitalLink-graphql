import { ApolloServer } from "@apollo/server";
import { User } from "./user";

const createServer = () => {
  const server = new ApolloServer({
    typeDefs: `
    ${User.typedefs}
    type Query {
      ${User.queries}
    }
    type Mutation {
      ${User.mutations}
    }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutations,
      },
    },
  });
  return server;
};

export default createServer;
