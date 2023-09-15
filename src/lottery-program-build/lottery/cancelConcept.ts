import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { SolpixLottery } from "@/lottery-program-build/types/0.1.0/solpix_lottery";
import type { AccountParams, Methods } from "../utilityTypes";
import { pdas } from "..";

type method = Methods<"cancelConcept">;

export default async function cancelConcept({
  authority,
  program,
  lottery,
}: {
  authority: PublicKey;
  lottery: PublicKey;
  program: anchor.Program<SolpixLottery>;
}) {
  const [lotteryManager] = pdas.lotteryPdas.getLotteryManagerPda(authority);

  const accounts: AccountParams<method> = {
    authority,
    lottery,
    lotteryManager,
  };

  // Prepare the instruction
  const instruction = await program.methods
    .cancelConcept()
    .accounts(accounts)
    .instruction();

  // Return the instruction for signing
  return {
    instruction,
    accounts,
  };
}
