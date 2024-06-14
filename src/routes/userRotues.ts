import { FastifyInstance } from "fastify";
import { getUsers, createUser, loginUser } from "../controllers/userController";

export const userRoutes = (app: FastifyInstance) => {
  app.get("/users", getUsers);
  app.post("/users", createUser);
  app.post("/login", loginUser);
};
