import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Keypair,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";
import { SolpixLottery } from "@/lottery-program-build/types/0.1.0/solpix_lottery";
import { AccountParams, InstructionParams, Methods } from "../utilityTypes";
import { lotteryPdas, metaplexPdas } from "../pdas";
import { METADATA_PROGRAM_ID } from "../common";

type method = Methods<"startLottery">;

export default async function startLottery({
  program,
  authority,
  lottery,
  params,
}: {
  program: anchor.Program<SolpixLottery>;
  authority: PublicKey;
  lottery: PublicKey;
  params: InstructionParams<method>;
}) {
  const [lotteryManager] = lotteryPdas.getLotteryManagerPda(authority);
  const [mint] = lotteryPdas.getLotteryMint(lottery);
  const [metadata] = metaplexPdas.metadata(mint);
  const [masterEdition] = metaplexPdas.masterEdition(mint);
  const tokenAccount = getAssociatedTokenAddressSync(mint, authority);
  const [lotteryPdaAuthority] = lotteryPdas.getAuthorityPda(lottery);

  const accounts: AccountParams<method> = {
    authority,
    lotteryManager,
    lottery,
    mint,
    metadata,
    masterEdition,
    tokenAccount,
    lotteryPdaAuthority,
    metadataProgram: METADATA_PROGRAM_ID, // Change this to actual Metadata Program ID
    systemProgram: SystemProgram.programId,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    rent: SYSVAR_RENT_PUBKEY,
  };

  // Prepare the instruction
  const instruction = await program.methods
    .startLottery(params)
    .accounts(accounts)
    .instruction();

  // Return the instruction for signing
  return {
    instruction,
    accounts,
  };
}
