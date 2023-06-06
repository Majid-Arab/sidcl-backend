import { z } from "zod";
import { prisma } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  getCategory: publicProcedure.input(z.number()).query(async ({ input }) => {
    const category = await prisma.category.findUnique({ where: { id: input } });
    if (!category) throw new Error("Category not found");
    return category;
  }),

  paginated: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const categories = await prisma.category.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "desc",
        },
      });
      let nextCursor = undefined;
      if (categories.length > limit) {
        const nextItem = categories.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items: categories,
        nextCursor,
      };
    }),

  createCategory: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const category = await prisma.category.create({ data: input });
      return category;
    }),

  updateCategory: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const category = await prisma.category.update({
          where: { id: input.id },
          data: { name: input.name },
        });
        return category;
      } catch (error) {
        console.log(error);
        throw new Error("Failed to update category");
      }
    }),

  deleteCategory: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      const category = await prisma.category.delete({ where: { id: input } });
      return category;
    }),
});
