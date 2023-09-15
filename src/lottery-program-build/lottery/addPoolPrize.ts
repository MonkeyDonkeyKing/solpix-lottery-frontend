import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { SolpixLottery } from "@/lottery-program-build/types/0.1.0/solpix_lottery";
import { AccountParams, Methods } from "../utilityTypes";
import { lotteryPdas } from "../pdas";

type method = Methods<"addPoolPrize">;

export default async function addPoolPrize({
  program,
  authority,
  lottery,
  value,
}: {
  program: anchor.Program<SolpixLottery>;
  authority: PublicKey;
  lottery: PublicKey;
  value: number;
}) {
  const [lotteryManager] = lotteryPdas.getLotteryManagerPda(authority);

  const accounts: AccountParams<method> = {
    authority,
    lotteryManager,
    lottery,
  };

  // Prepare the instruction
  const instruction = await program.methods
    .addPoolPrize({
      pool: {
        value: value,
      },
    })
    .accounts(accounts)
    .instruction();

  // Return the instruction for signing
  return {
    instruction,
    accounts,
  };
}
