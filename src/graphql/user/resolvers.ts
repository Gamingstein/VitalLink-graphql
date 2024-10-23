import { services } from "../../services";

const queries = {
  users: async () => {
    return await services.user.getAllUsers();
  },
};
const mutations = {
  createUser: async (_: any, args: any) => {
    return await services.user.createUser(args);
  },
};
export const resolvers = { queries, mutations };
