import { z } from "zod";
import { prisma } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const complainerRouter = createTRPCRouter({
    getComplainer: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const complainer = await prisma.complainer.findUnique({ where: { id: input } });
        if (!complainer) throw new Error('Complainer not found');
        return complainer;
      }),
  
    createComplainer: publicProcedure
      .input(z.object({
        id: z.number(),
        first_name: z.string(),
        last_name: z.string().optional(),
        email: z.string().optional(),
        password: z.string().optional(),
        phone: z.string().optional(),
        created_at: z.date(),
        updated_at: z.date(),
        deleted_at: z.date(),
      }))
      .mutation(async ({ input }) => {
        const complainer = await prisma.complainer.create({ data: input });
        return complainer;
      }),
  
    updateComplainer: publicProcedure
      .input(z.object({
        id: z.number(),
        first_name: z.string(),
        last_name: z.string().optional(),
        email: z.string().optional(),
        password: z.string().optional(),
        phone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const complainer = await prisma.complainer.update({
            where: { id: input.id },
            data: {
              first_name: input.first_name,
              last_name: input.last_name,
              email: input.email,
              password: input.password,
              phone: input.phone,
            },
          });
          return complainer;
        } catch (error) {
          console.log(error);
          throw new Error('Failed to update complainer');
        }
      }),
  
    deleteComplainer: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        const complainer = await prisma.complainer.delete({ where: { id: input } });
        return complainer;
      }),
  });
  