import { z } from "zod";
import { prisma } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
    getCategory: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const category = await prisma.category.findUnique({ where: { id: input } });
        if (!category) throw new Error('Category not found');
        return category;
      }),
  
    createCategory: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string(),
        created_at: z.date(),
        updated_at: z.date(),
        deleted_at: z.date(),
      }))
      .mutation(async ({ input }) => {
        const category = await prisma.category.create({ data: input });
        return category;
      }),
  
    updateCategory: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          const category = await prisma.category.update({
            where: { id: input.id },
            data: { name: input.name },
          });
          return category;
        } catch (error) {
          console.log(error);
          throw new Error('Failed to update category');
        }
      }),
  
    deleteCategory: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        const category = await prisma.category.delete({ where: { id: input } });
        return category;
      }),
  });
  