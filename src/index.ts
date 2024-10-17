import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createServer from "./graphql";

const app = express();
app.use(express.json());
const server = createServer();
(async () => {
  await server.start();
  app.use("/graphql", expressMiddleware(server));
})();

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000/graphql");
});
