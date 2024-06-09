import { PrismaClient } from "@prisma/client";
import { createUserSchema } from "../schemas/userSchema";
import { FastifyRequest, FastifyReply } from "fastify";

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
};
