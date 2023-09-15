import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { SolpixLottery } from "@/lottery-program-build/types/0.1.0/solpix_lottery";
import { AccountParams, InstructionParams, Methods } from "../utilityTypes";
import { lotteryPdas } from "../pdas";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

type method = Methods<"removePrize">;
type params = Omit<InstructionParams<method>, "spl" | "sft">;

export default async function removePrize({
  program,
  authority,
  lottery,
  params,
}: {
  program: anchor.Program<SolpixLottery>;
  authority: PublicKey;
  lottery: PublicKey;
  params: params;
}) {
  const [lotteryManager] = lotteryPdas.getLotteryManagerPda(authority);
  const [prizeVault] = lotteryPdas.getPrizeVaultPda(lottery);

  const accounts: AccountParams<method> = {
    authority: authority,
    lotteryManager,
    lottery,
    prizeVault,
    mint: params.nft ? params.nft.mint : null,
    prizeVaultAta: params.nft
      ? getAssociatedTokenAddressSync(params.nft.mint, prizeVault, true)
      : null,
    authorityAta: params.nft
      ? getAssociatedTokenAddressSync(params.nft.mint, authority)
      : null,
  };

  // Prepare the instruction
  const instruction = await program.methods
    .removePrize(params as InstructionParams<method>)
    .accounts(accounts)
    .instruction();

  // Return the instruction for signing
  return {
    instruction,
    accounts,
  };
}
