import { FastifyInstance } from "fastify";
import { getUsers, createUser } from "../controllers/userController";

export const userRoutes = (app: FastifyInstance) => {
  app.get("/users", getUsers);
  app.post("/users", createUser);
};
