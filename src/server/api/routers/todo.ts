import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
export const todoRouter = createTRPCRouter({
  getAll: publicProcedure.input(z.void()).query(({ ctx }) => {
    return ctx.prisma.todo.findMany({ orderBy: [{ createdAt: "desc" }] });
  }),
  add: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { text } = input;
      return ctx.prisma.todo.create({
        data: {
          done: false,
          text,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      const { id } = input;
      return ctx.prisma.todo.delete({ where: { id } });
    }),
  done: publicProcedure
    .input(z.object({ id: z.string(), done: z.boolean() }))
    .mutation(({ ctx, input }) => {
      const { id, done } = input;
      console.log(`id=`, id, ` done=`, done);
      return ctx.prisma.todo.update({ where: { id }, data: { done } });
    }),
});