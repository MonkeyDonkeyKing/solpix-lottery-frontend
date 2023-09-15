import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import anchor, { Program } from "@coral-xyz/anchor";
import { SolpixLottery } from "@/lottery-program-build/types/0.1.0/solpix_lottery";
import { AccountParams, InstructionParams, Methods } from "../utilityTypes";
import { lotteryPdas } from "../pdas";

type method = Methods<"initializeLotteryManager">;

export default async function initializeLotteryManager({
  program,
  authority,
  assignee,
  params,
}: {
  program: anchor.Program<SolpixLottery>;
  authority: PublicKey;
  assignee: PublicKey;
  params: InstructionParams<method>;
}) {
  // Construct the associated addresses
  const [programManager] = lotteryPdas.getProgramManagerPda();
  const [lotteryManager] = lotteryPdas.getLotteryManagerPda(assignee);

  const accounts: AccountParams<method> = {
    authority,
    programManager,
    assignee,
    lotteryManager,
    systemProgram: SystemProgram.programId,
  };

  // Prepare the instruction
  const instruction = await program.methods
    .initializeLotteryManager(params)
    .accounts(accounts)
    .instruction();

  // Return the instruction for signing
  return { instruction, accounts };
}
