import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { expressMiddleware } from "@apollo/server/express4";
import createServer from "./graphql";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const server = createServer();
(async () => {
  await server.start();
  app.use("/graphql", expressMiddleware(server));
})();

import UserRouter from "./routes/user.routes";
app.use("/user", UserRouter);

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000/graphql");
});
