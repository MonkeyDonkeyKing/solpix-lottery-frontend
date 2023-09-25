import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PublicKey, TransactionMessage } from "@solana/web3.js";
import { methods, pdas } from "@/lottery-program-build";

import { TRPCError } from "@trpc/server";
import { BN } from "@coral-xyz/anchor";
// convert the date into unix timestamp

const CappedLotterySchema = z.object({
  autoAnnounceWinnersAfter: z
    .date()
    .transform((date) => new BN(date.getTime() / 1000)),
});

const TimeLotterySchema = z.object({
  endTime: z.date().transform((date) => new BN(date.getTime() / 1000)),
  requiredMinTicketsSold: z.number(),
});

export const lotteryRouter = createTRPCRouter({
  initializeLottery: publicProcedure
    .input(
      z.object({
        params: z.object({
          maxTicketsForSale: z.number().nonnegative(),
          LotteryType: z.union([
            z.object({ capped: CappedLotterySchema }),
            z.object({ time: TimeLotterySchema }),
          ]),
          ticketPrice: z.number().transform((sol) => new BN(sol * 10 ** 9)),
        }),
        lotteryManagerPublicKey: z.string().transform((key) => {
          return new PublicKey(key);
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { LotteryType } = input.params;
      if (!LotteryType) throw new TRPCError({ code: "BAD_REQUEST" });
      if (!input.params.maxTicketsForSale)
        throw new TRPCError({ code: "BAD_REQUEST" });
      let lotteryTypeKey, lotteryTypeValue;

      if ("capped" in LotteryType) {
        lotteryTypeKey = "capped";
        lotteryTypeValue = LotteryType.capped;
      } else if ("time" in LotteryType) {
        lotteryTypeKey = "time";
        lotteryTypeValue = LotteryType.time;
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }

      const result = await methods.lottery
        .initializeLottery({
          params: {
            // @ts-ignore
            lotteryType: {
              [lotteryTypeKey]: { ...lotteryTypeValue },
            },
            maxTicketsForSale: input.params.maxTicketsForSale,
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
  startLottery: publicProcedure
    .input(
      z.object({
        authority: z.string().transform((key) => {
          return new PublicKey(key);
        }),
        lottery: z.string().transform((key) => {
          return new PublicKey(key);
        }),
        name: z.string(),
        symbol: z.string(),
        uri: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await methods.lottery.startLottery({
        authority: input.authority,
        lottery: input.lottery,
        program: ctx.program,
        params: {
          name: input.name,
          symbol: input.symbol,
          uri: input.uri,
        },
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
    .output(z.any())
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
      return adminLotteries;
    }),
  isAdmin: publicProcedure
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
      const lotteryManagerData = await ctx.program.account.lotteryManager
        .fetch(lotteryManagerAccount)
        .catch((err) => {
          return null;
        });

      return lotteryManagerData !== null;
    }),
});
