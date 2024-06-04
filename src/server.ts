import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from "zod";

const app = fastify();

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
    name: z.string(),
    email: z.string().email(),
  });

  //Parse não deixa o codigo executar caso falhe validação
  const { name, email } = createUserSchema.parse(request.body);

  await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  return reply.status(201).send();
});

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log("HTTP Server Running");
  });
