import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import axios from "axios";

export const llmRouter = createTRPCRouter({
  sendPrompt: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      async function sendRequest(): Promise<string> {
        const API_KEY = process.env.OPENAI_API_KEY;
        const URL = "https://api.openai.com/v1/chat/completions";
        try {
          const response = await axios.post(
            URL,
            {
              messages: [
                { role: "system", content: input.text },
              ],
              model: "gpt-3.5-turbo",
              max_tokens: 200
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ API_KEY }`,
              },
            }
          );
          console.log(response);
          return response.data.choices[0].message.content;
        } catch (error) {
          console.log(error);
          return "error";
        }
      }

      const response = await sendRequest();
      return {
        text: response,
      };
    }),

});