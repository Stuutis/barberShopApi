import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { userRoutes } from "./routes/userRotues";

const app = fastify();

app.register(fastifyCors, {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
});

userRoutes(app);

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log("HTTP Server Running ");
    console.log("CORS Plugin Applied:", app.hasDecorator("cors"));
  });
