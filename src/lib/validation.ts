import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const ReviewCreateSchema = z.object({
  volumeId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().max(5000).optional(),
});

export const VoteSchema = z.object({
  value: z.enum(["up", "down"]), // lo mapeamos a 1/-1 en el handler
});

//Blindar API en el borde (antes de la DB). Si el body está mal, responde 400 y listo.