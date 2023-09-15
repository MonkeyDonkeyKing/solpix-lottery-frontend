import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { SolpixLottery } from "@/lottery-program-build/types/0.1.0/solpix_lottery";
import { AccountParams, Methods } from "../utilityTypes";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { lotteryPdas, metaplexPdas } from "../pdas";

type method = Methods<"addNftPrize">;

export default async function addNftPrize({
  program,
  authority,
  lottery,
  mint,
}: {
  program: anchor.Program<SolpixLottery>;
  authority: PublicKey;
  lottery: PublicKey;
  mint: PublicKey;
}) {
  const [lotteryManager] = lotteryPdas.getLotteryManagerPda(authority);
  const [prizeVault] = lotteryPdas.getPrizeVaultPda(lottery);
  const receiverAta = getAssociatedTokenAddressSync(mint, prizeVault, true);
  const senderAta = getAssociatedTokenAddressSync(mint, authority);
  const [masterEdition] = metaplexPdas.masterEdition(mint);
  const [metadata] = metaplexPdas.metadata(mint);

  const accounts: AccountParams<method> = {
    authority: authority,
    lotteryManager,
    lottery,
    prizeVault,
    receiverAta,
    senderAta,
    mint,
    metadata,
    masterEdition,
  };

  // Prepare the instruction
  const instruction = await program.methods
    .addNftPrize()
    .accounts(accounts)
    .instruction();

  // Return the instruction for signing
  return {
    instruction,
    accounts,
  };
}
