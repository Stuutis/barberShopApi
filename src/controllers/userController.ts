import { Prisma, PrismaClient } from "@prisma/client";
import { createUserSchema } from "../schemas/userSchema";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export const getUsers = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const users = await prisma.user.findMany();
  return { users };
};

export const createUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
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
    return reply.status(201).send({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: error.errors });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = (error.meta as { target?: string[] }).target;
        if (target && target.includes("email")) {
          return reply.status(409).send({ error: "Email já existe." });
        }
      }
    }
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};
