import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { SolpixLottery } from "@/lottery-program-build/types/0.1.0/solpix_lottery";
import { AccountParams, InstructionParams, Methods } from "../utilityTypes";
import { lotteryPdas } from "../pdas";

type method = Methods<"initializeLottery">;

export default async function initializeLottery({
  program,
  lotteryManagerPublicKey,
  params,
}: {
  program: anchor.Program<SolpixLottery>;
  lotteryManagerPublicKey: PublicKey;
  params: InstructionParams<method>;
}) {
  // Construct the associated addresses

  const [lotteryManager] = lotteryPdas.getLotteryManagerPda(
    lotteryManagerPublicKey
  );

  const accountData = await program.account.lotteryManager.fetch(
    lotteryManager
  );

  const [lotteryAccountAddress] = lotteryPdas.getLotteryPda(
    lotteryManagerPublicKey,
    accountData.nextLotteryId
  );

  const accounts: AccountParams<method> = {
    authority: lotteryManagerPublicKey,
    lotteryManager,
    lottery: lotteryAccountAddress,
    systemProgram: anchor.web3.SystemProgram.programId,
  };

  // Prepare the instruction
  const instruction = await program.methods
    .initializeLottery(params)
    .accounts(accounts)
    .instruction();

  // Return the instruction for signing
  return {
    instruction,
    accounts,
  };
}
