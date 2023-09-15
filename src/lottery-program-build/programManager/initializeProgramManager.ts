import { PublicKey, SystemProgram } from "@solana/web3.js";
import anchor from "@coral-xyz/anchor";
import { SolpixLottery } from "@/lottery-program-build/types/0.1.0/solpix_lottery";
import { AccountParams, Methods } from "../utilityTypes";
import { lotteryPdas } from "../pdas";

type method = Methods<"initializeProgramManager">;

export default async function initializeProgramManager({
  program,
  auhtority,
}: {
  program: anchor.Program<SolpixLottery>;
  auhtority: PublicKey;
}) {
  // Construct the associated address
  const [programManagerAccountAddress] = lotteryPdas.getProgramManagerPda();

  const accounts: AccountParams<method> = {
    signer: auhtority,
    programManagerAccount: programManagerAccountAddress,
    systemProgram: SystemProgram.programId,
  };

  // Prepare the instruction
  const instruction = await program.methods
    .initializeProgramManager()
    .accounts(accounts)
    .instruction();

  // Return the instruction for signing
  return {
    instruction,
    accounts,
  };
}
