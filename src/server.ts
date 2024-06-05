import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";

const app = fastify();
app.register(cors, {
  origin: "https://barbershopapi-deploy.onrender.com/",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
});

const prisma = new PrismaClient();

// Rota para listar usuarios
app.get("/users", async () => {
  const users = await prisma.user.findMany();

  return { users };
});

// Rota para criação de usuarios
app.post("/users", async (request, reply) => {
  // Schema pro zod validar os campos.
  const createUserSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  //Parse não deixa o codigo executar caso falhe validação
  const { firstName, lastName, email, password } = createUserSchema.parse(
    request.body
  );

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password,
    },
  });

  reply.header("Access-Control-Allow-Origin", "http://localhost:5173");

  return reply.status(201).send();
});

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log("HTTP Server Running");
    console.log("CORS Plugin Applied:", app.hasDecorator("cors"));
  });
