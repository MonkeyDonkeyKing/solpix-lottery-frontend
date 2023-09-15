import { PublicKey, SystemProgram } from "@solana/web3.js";
import anchor from "@coral-xyz/anchor";
import { SolpixLottery } from "@/lottery-program-build/types/0.1.0/solpix_lottery";
import { Methods, InstructionParams, AccountParams } from "../utilityTypes";
import { lotteryPdas } from "../pdas";

type method = Methods<"updateLotteryManager">;

export default async function updateLotteryManager({
  program,
  authority,
  params,
}: {
  program: anchor.Program<SolpixLottery>;
  authority: PublicKey;
  params: InstructionParams<method>;
}) {
  // Construct the associated addresses
  const [programManager] = lotteryPdas.getProgramManagerPda();
  const [lotteryManager] = lotteryPdas.getLotteryManagerPda(authority);

  const accounts: AccountParams<method> = {
    authority,
    programManager,
    lotteryManager,
    systemProgram: SystemProgram.programId,
  };

  // Prepare the instruction
  const instruction = await program.methods
    .updateLotteryManager(params)
    .accounts(accounts)
    .instruction();

  // Return the instruction for signing
  return { instruction, accounts };
}
