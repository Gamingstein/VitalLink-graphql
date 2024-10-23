import { services } from "../../services";

const queries = {
  users: async () => {
    return await services.user.getAllUsers();
  },
  user: async (_: any, args: any) => {
    return await services.user.getUserById(args);
  },
};

const nestedQueries = {};

export const resolvers = { queries, nestedQueries };
