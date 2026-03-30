import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["buyer", "investor"]),
  phone: z.string().optional()
});

export const propertySchema = z.object({
  title: z.string().min(4),
  description: z.string().min(20),
  type: z.string().min(2),
  price: z.number().positive(),
  areaSqFt: z.number().positive(),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  city: z.string().min(2),
  locality: z.string().min(2)
});

export const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  source: z.string().min(2),
  status: z.enum(["new", "contacted", "qualified", "closed"])
});
