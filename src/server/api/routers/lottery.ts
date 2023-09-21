import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PublicKey, TransactionMessage } from "@solana/web3.js";
import { methods, pdas } from "@/lottery-program-build";
import * as anchor from "@coral-xyz/anchor";
import lottery from "@/lottery-program-build/lottery";
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
          maxTicketsForSale: z.number().nonnegative(),
          LotteryType: z.union([
            z.object({ capped: CappedLotterySchema }),
            z.object({ time: TimeLotterySchema }),
          ]),
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
      // const [key, value] = Object.entries(input.params.LotteryType!)[0];
      // console.log(key, value);
      console.log(input.params.LotteryType!.time);
      const result = await methods.lottery
        .initializeLottery({
          params: {
            lotteryType: {
              time: {
                endTime: input.params.LotteryType!.time.endTime,
                requiredMinTicketsSold:
                  input.params.LotteryType!.time.requiredMinTicketsSold,
              },
            },
            maxTicketsForSale: input.params.maxTicketsForSale!,
            ticketPrice: {
              sol: {
                value: new anchor.BN(100),
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
      console.log(Number(adminLotteries[0]?.account.ticketPrice.sol?.value));
      return adminLotteries;
    }),
});
