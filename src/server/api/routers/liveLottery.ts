import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PublicKey, TransactionMessage } from "@solana/web3.js";
import { methods, pdas } from "@/lottery-program-build";
import * as anchor from "@coral-xyz/anchor";
import { TRPCError } from "@trpc/server";

export const lotteryRouter = createTRPCRouter({});
