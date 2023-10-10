import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PublicKey, TransactionMessage } from "@solana/web3.js";
import { methods, pdas } from "@/lottery-program-build";

import { TRPCError } from "@trpc/server";
import { BN } from "@coral-xyz/anchor";
import { lotteryPdas } from "@/lottery-program-build/pdas";
import { Metaplex } from "@metaplex-foundation/js";
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
  getAllLotteries: publicProcedure
    .input(z.object({}))
    .query(async ({ ctx, input }) => {
      const lotteries = await ctx.program.account.lottery.all();
      return lotteries;
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
  buyTicket: publicProcedure
    .input(
      z.object({
        buyer: z.string().transform((key) => {
          return new PublicKey(key);
        }),
        lottery: z.string().transform((key) => {
          return new PublicKey(key);
        }),
        quantity: z.number().min(1).max(3),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await methods.lottery.buyTicket({
        buyer: input.buyer,
        lottery: input.lottery,
        program: ctx.program,
        amount: input.quantity,
      });

      const msg = new TransactionMessage({
        instructions: result.instructions,
        payerKey: input.buyer,
        recentBlockhash: (await ctx.solanaRpc.getLatestBlockhash()).blockhash,
      }).compileToV0Message();

      return msg.serialize();
    }),
  getLotteryData: publicProcedure
    .input(
      z.object({
        lottery: z.string().transform((key) => {
          return new PublicKey(key);
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      const lotteryData = await ctx.program.account.lottery.fetch(
        input.lottery
      );

      return lotteryData;
    }),
  getLotteryTicketsByUser: publicProcedure
    .input(
      z.object({
        userAddress: z.string().transform((key) => {
          return new PublicKey(key);
        }),
        lotteryAddress: z.string().transform((key) => {
          return new PublicKey(key);
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userAddress, lotteryAddress } = input;
      const [lotteryPdaAuthority] = lotteryPdas.getAuthorityPda(lotteryAddress);
      const [collectionMint] = lotteryPdas.getLotteryMint(lotteryAddress);
      const [lotteryPrizeVault] = lotteryPdas.getPrizeVaultPda(lotteryAddress);
      const mplx = Metaplex.make(ctx.program.provider.connection);
      const signerNfts = await mplx.nfts().findAllByOwner({
        owner: userAddress,
      });
      const lotteryData = await ctx.program.account.lottery.fetch(
        lotteryAddress
      );
      const winnerTicketAddresses = lotteryData.winningTickets.map((ticket) => {
        return {
          ticketId: ticket.ticketId,
          address: lotteryPdas.getLotteryTicketMint(
            lotteryAddress,
            ticket.ticketId
          )[0],
        };
      });
      const prizeArray = [...lotteryData.prizes];
      const ticketsByOwner = signerNfts.filter(
        (nft) =>
          nft.collection?.verified &&
          nft.collection.address.equals(collectionMint)
      );
      const tickets = ticketsByOwner.map((nft) => {
        const ticket = {
          ...nft,
          prize: null,
        };
        const indexof = lotteryData.winningTickets.findIndex((index) =>
          ticket?.mintAddress?.equals(index.mint)
        );
        if (indexof !== -1) {
          const prize = prizeArray[indexof];
          ticket.prize = prize;
        }
        return ticket;
      });

      return tickets;
    }),
    drawWinners: publicProcedure
    .input(
      z.object({
        lottery: z.string().transform((key) => new PublicKey(key)),
        admin: z.string().transform((key) => new PublicKey(key)),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { lottery, admin } = input;

      const result = await methods.lottery.drawWinners({
        program: ctx.program,
        lottery: lottery,
      });

      const msg = new TransactionMessage({
        instructions: [result.instruction],
        payerKey: admin,
        recentBlockhash: (await ctx.solanaRpc.getLatestBlockhash()).blockhash,
      }).compileToV0Message();

      return msg.serialize();
    }),
});
