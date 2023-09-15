import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { SolpixLottery } from "@/lottery-program-build/types/0.1.0/solpix_lottery";
import type { AccountParams, Methods } from "../utilityTypes";

type method = Methods<"drawWinners">;

export default async function drawWinners({
  program,
  lottery,
}: {
  program: anchor.Program<SolpixLottery>;
  lottery: PublicKey;
}) {
  const accounts: AccountParams<method> = {
    lotteryAccount: lottery,
    recentSlothashes: new PublicKey(
      "SysvarS1otHashes111111111111111111111111111"
    ),
  };

  // Prepare the instruction
  const instruction = await program.methods
    .drawWinners()
    .accounts(accounts)
    .instruction();

  // Return the instruction for signing
  return {
    instruction,
    accounts,
  };
}
