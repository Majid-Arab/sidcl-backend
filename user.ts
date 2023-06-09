import { z } from "zod";
import { prisma } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { id: input } });
      if (!user) throw new Error('User not found');
      return user;
    }),

  createUser: publicProcedure
    .input(z.object({
      id: z.number(),
      first_name: z.string(),
      last_name: z.string().optional(),
      email: z.string().optional(),
      password: z.string().optional(),
      phone: z.string().optional(),
      role_id: z.number().optional(),
      roles: z.enum(['ADMIN', 'COMPLAINT_RECORDER', 'COMPLAINT_RESOLVER']),
      created_at: z.date(),
      updated_at: z.date(),
      deleted_at: z.date(),
      category_id: z.array(z.number()),
    }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.create({ data: input });
      return user;
    }),

  updateUser: publicProcedure
    .input(z.object({
      id: z.number(),
      first_name: z.string(),
      last_name: z.string().optional(),
      email: z.string().optional(),
      password: z.string().optional(),
      phone: z.string().optional(),
      role_id: z.number().optional(),
      roles: z.enum(['ADMIN', 'COMPLAINT_RECORDER', 'COMPLAINT_RESOLVER']),
      category_id: z.array(z.number()),
      assignedComplaints: z.array(z.number()),
      recordedComplaints: z.array(z.number()),
      complaineeRecords: z.array(z.number()),
      complaint: z.array(z.number()),
    }))
    .mutation(async ({ input }) => {
      try {
        const user = await prisma.user.update({
          where: { id: input.id },
          data: {
            first_name: input.first_name,
            last_name: input.last_name,
            email: input.email,
            password: input.password,
            phone: input.phone,
            role_id: input.role_id,
            roles: input.roles,
            category_id: input.category_id,
            // assignedComplaints: input.assignedComplaints,
            // recordedComplaints: input.recordedComplaints,
            // complaineeRecords: input.complaineeRecords,
            // complaint: input.complaint,
          },
        });
        return user;
      } catch (error) {
        console.log(error);
        throw new Error('Failed to update user');
      }
    }),

  deleteUser: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      const user = await prisma.user.delete({ where: { id: input } });
      return user;
    }),
});
