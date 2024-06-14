import { Prisma, PrismaClient } from "@prisma/client";
import { createUserSchema } from "../schemas/userSchema";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = "pkL!çEfb423$";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

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

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
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

export const loginUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { email, password } = loginSchema.parse(request.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log("Usuário não encontrado");
      return reply.status(404).send({ error: "Usuário não encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Senha incorreta");
      return reply.status(401).send({ error: "Senha incorreta" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    reply.header("Access-Control-Allow-Origin", "http://localhost:5173");
    return reply.status(200).send({ token });
  } catch (error) {
    console.error("Erro no login:", error);
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: error.errors });
    }
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};
