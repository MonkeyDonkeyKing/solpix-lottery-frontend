import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PublicKey } from "@solana/web3.js";
import { methods } from "@/lottery-program-build";
import * as anchor from "@coral-xyz/anchor";
// convert the date into unix timestamp
const CappedLotterySchema = z.object({
  autoAnnounceWinnersAfter: z
    .date()
    .transform((date) => new anchor.BN(date.getTime() / 1000)),
});

const TimeLotterySchema = z.object({
  endTime: z.date().transform((date) => date.getTime() / 1000),
  requiredMinTicketsSold: z.number(),
});

export const lotteryRouter = createTRPCRouter({
  initializeLottery: publicProcedure
    .input(
      z.object({
        params: z.object({
          LotteryType: z.union([
            z.object({ capped: CappedLotterySchema }),
            z.object({ time: TimeLotterySchema }),
          ]),
          maxTicketsForSale: z.number(),
          ticketPrice: z
            .number()
            .transform((sol) => new anchor.BN(sol * 10 ** 9)),
        }),
        lotteryManagerPublicKey: z.string().transform((key) => {
          return new PublicKey(key);
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      console.log(input);
      const result = await methods.lottery
        .initializeLottery({
          params: {
            lotteryType: input.params.LotteryType as any,
            maxTicketsForSale: input.params.maxTicketsForSale!,
            ticketPrice: {
              sol: {
                value: input.params.ticketPrice,
              },
            },
          },
          lotteryManagerPublicKey: input.lotteryManagerPublicKey,
          program: ctx.program,
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });

      return result;
    }),
});
