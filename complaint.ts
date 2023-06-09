import { z } from "zod";
import { prisma } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const complaintRouter = createTRPCRouter({
  getComplaint: publicProcedure.input(z.number()).query(async ({ input }) => {
    const complaint = await prisma.complaint.findUnique({
      where: { id: input },
    });
    if (!complaint) throw new Error("Complaint not found");
    return complaint;
  }),

  createComplaint: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        message: z.string(),
        status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
        user_id: z.number(),
        resolver_id: z.number(),
        recorder_id: z.number(),
        category_id: z.number(),
        complainee_id: z.number(),
        complainer_id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      // const complaint = await prisma.complaint.create({ data: input });
      // return complaint;
    }),

  updateComplaint: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        message: z.string(),
        status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
        user_id: z.number(),
        resolver_id: z.number(),
        recorder_id: z.number(),
        category_id: z.number(),
        complainee_id: z.number(),
        complainer_id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const complaint = await prisma.complaint.update({
          where: { id: input.id },
          data: {
            title: input.title,
            message: input.message,
            status: input.status,
            //   priority: input.priority,
            category_id: input.category_id,
            //   assigned_to: input.assigned_to,
          },
        });
        return complaint;
      } catch (error) {
        console.log(error);
        throw new Error("Failed to update complaint");
      }
    }),

  deleteComplaint: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      const complaint = await prisma.complaint.delete({ where: { id: input } });
      return complaint;
    }),
});
