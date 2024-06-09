import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(1, "O campo não pode estar vazio zod"),
  lastName: z.string().min(1, "O campo não pode estar vazio zod"),
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});
