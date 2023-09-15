import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import anchor from "@coral-xyz/anchor";
import { SolpixLottery } from "@/lottery-program-build/types/0.1.0/solpix_lottery";
import { AccountParams, Methods } from "../utilityTypes";
import { lotteryPdas } from "../pdas";

type method = Methods<"updateProgramManager">;

export default async function updateProgramManager({
  program,
  authority,
  newAuthorityPublicKey,
}: {
  program: anchor.Program<SolpixLottery>;
  authority: PublicKey;
  newAuthorityPublicKey: PublicKey;
}) {
  // Construct the associated address
  const [programManager] = lotteryPdas.getProgramManagerPda();

  const accounts: AccountParams<method> = {
    authority,
    programManager,
    newAuthority: newAuthorityPublicKey,
  };

  // Prepare the instruction
  const instruction = await program.methods
    .updateProgramManager()
    .accounts(accounts)
    .instruction();

  // Return the instruction for signing
  return {
    instruction,
    accounts,
  };
}
