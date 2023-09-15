import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { SolpixLottery } from "@/lottery-program-build/types/0.1.0/solpix_lottery";
import type { AccountParams, Methods } from "../utilityTypes";
import { pdas } from "..";

type method = Methods<"cleanupWinners">;

export default async function cleanupWinners({
  program,
  lottery,
}: {
  program: anchor.Program<SolpixLottery>;
  lottery: PublicKey;
}) {
  const accounts: AccountParams<method> = {
    lottery,
  };

  // Prepare the instruction
  const instruction = await program.methods
    .cleanupWinners()
    .accounts(accounts)
    .instruction();

  // Return the instruction for signing
  return instruction;
}
