import { expressMiddleware } from "@apollo/server/express4";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import createServer from "./graphql";
import { DoctorRouter, HospitalRouter, UserRouter } from "./routes";
import { doctorAuthMiddleware, hospitalAuthMiddleware } from "./middlewares";
import { services } from "./services";

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

const gqlInit = async () => {
  const server = createServer();
  await server.start();
  app.use("/graphql", expressMiddleware(server));
};

gqlInit();
app.use("/user", UserRouter);
app.use("/hospital", hospitalAuthMiddleware, HospitalRouter);
app.use("/doctor", doctorAuthMiddleware, DoctorRouter);

app.all("/", (_, res) =>
  res
    .send("Server is running")
    .json({ status: "ok", message: "Server is running" }),
);
app.post("/data", services.data.postSensorData);

app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running on http://localhost:8000/");
});
