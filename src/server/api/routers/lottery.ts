import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PublicKey, TransactionMessage } from "@solana/web3.js";
import { methods, pdas } from "@/lottery-program-build";
import * as anchor from "@coral-xyz/anchor";
// convert the date into unix timestamp
const CappedLotterySchema = z.object({
  autoAnnounceWinnersAfter: z
    .date()
    .transform((date) => new anchor.BN(date.getTime() / 1000)),
});

const TimeLotterySchema = z.object({
  endTime: z.date().transform((date) => new anchor.BN(date.getTime() / 1000)),
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
    .mutation(async ({ ctx, input }) => {
      const result = await methods.lottery
        .initializeLottery({
          params: {
            lotteryType: {
              capped: {
                autoAnnounceWinnersAfter: new anchor.BN(
                  new Date().getTime() / 1000 + 60 * 60 * 24 * 7
                ),
              },
            },
            maxTicketsForSale: 100,
            ticketPrice: {
              sol: {
                value: new anchor.BN(1000),
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

      const msg = new TransactionMessage({
        instructions: [result.instruction],
        payerKey: input.lotteryManagerPublicKey,
        recentBlockhash: (await ctx.solanaRpc.getLatestBlockhash()).blockhash,
      }).compileToV0Message();

      return msg.serialize();
    }),
  addNftPrice: publicProcedure
    .input(
      z.object({
        authority: z.string().transform((key) => {
          return new PublicKey(key);
        }),
        lottery: z.string().transform((key) => {
          return new PublicKey(key);
        }),
        mint: z.string().transform((key) => {
          return new PublicKey(key);
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await methods.lottery.addNftPrize({
        program: ctx.program,
        authority: input.authority,
        lottery: input.lottery,
        mint: input.mint,
      });

      const msg = new TransactionMessage({
        instructions: [result.instruction],
        payerKey: input.authority,
        recentBlockhash: (await ctx.solanaRpc.getLatestBlockhash()).blockhash,
      }).compileToV0Message();

      return msg.serialize();
    }),
  addPoolPrize: publicProcedure
    .input(
      z.object({
        authority: z.string().transform((key) => {
          return new PublicKey(key);
        }),
        lottery: z.string().transform((key) => {
          return new PublicKey(key);
        }),
        value: z.number().max(4_294_967_295).min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await methods.lottery.addPoolPrize({
        program: ctx.program,
        authority: input.authority,
        lottery: input.lottery,
        value: input.value,
      });

      const msg = new TransactionMessage({
        instructions: [result.instruction],
        payerKey: input.authority,
        recentBlockhash: (await ctx.solanaRpc.getLatestBlockhash()).blockhash,
      }).compileToV0Message();

      return msg.serialize();
    }),
  getLotteriesByAdmin: publicProcedure
    .input(
      z.object({
        admin: z.string().transform((key) => {
          return new PublicKey(key);
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      const lotteryManagerAccount = pdas.lotteryPdas.getLotteryManagerPda(
        input.admin
      )[0];
      const lotteries = await ctx.program.account.lottery.all();
      const adminLotteries = lotteries.filter((lottery) => {
        return lottery.account.associatedLotteryManager.equals(
          lotteryManagerAccount
        );
      });
      return new PublicKey("1adTuNaAAm1Neyz6LdNFG5sfQJC3cMjMQ1J9cz5pVhY");
    }),
});
