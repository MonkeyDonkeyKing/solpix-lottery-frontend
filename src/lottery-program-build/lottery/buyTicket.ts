import {
  Account,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";
import { SolpixLottery } from "@/lottery-program-build/types/0.1.0/solpix_lottery";
import { AccountParams, Methods } from "../utilityTypes";
import { lotteryPdas, metaplexPdas } from "../pdas";
import { METADATA_PROGRAM_ID } from "../common";

type method = Methods<"buyTicket">;

export default async function buyTicket({
  program,
  buyer,
  lottery,
  amount = 1,
}: {
  program: anchor.Program<SolpixLottery>;
  buyer: PublicKey;
  lottery: PublicKey;
  amount?: number;
}) {
  let ticketsSold = (await program.account.lottery.fetch(lottery)).ticketsSold;
  let maxTicketId = ticketsSold * 2 < 100 ? 100 : ticketsSold * 2;

  const instructions: TransactionInstruction[] = [];
  const ticketInformation: {
    ticketId: number;
    accounts: AccountParams<method>;
  }[] = [];

  for await (const _ of Array(amount)) {
    let ticketId = Math.floor(Math.random() * maxTicketId);
    // Make sure the ticketId is unique
    while (ticketInformation.find((t) => t.ticketId === ticketId)) {
      ticketId = Math.floor(Math.random() * maxTicketId);
    }

    const [lotteryPdaAuthority] = lotteryPdas.getAuthorityPda(lottery);
    const [prizeVault] = lotteryPdas.getPrizeVaultPda(lottery);
    const [mint] = lotteryPdas.getLotteryTicketMint(lottery, ticketId);
    const tokenAccount = getAssociatedTokenAddressSync(mint, buyer);
    const [metadata] = metaplexPdas.metadata(mint);
    const [masterEdition] = metaplexPdas.masterEdition(mint);
    const [collectionMint] = lotteryPdas.getLotteryMint(lottery);
    const [collectionMetadata] = metaplexPdas.metadata(collectionMint);
    const [collectionMasterEdition] =
      metaplexPdas.masterEdition(collectionMint);

    const accounts: AccountParams<method> = {
      buyer,
      lottery,
      lotteryPdaAuthority,
      prizeVault,
      mint,
      tokenAccount,
      metadata,
      masterEdition,
      collectionMint,
      collectionMetadata,
      collectionMasterEdition,
      systemProgram: SystemProgram.programId,
      // tokenProgram: TOKEN_PROGRAM_ID,
      // associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      // rent: SYSVAR_RENT_PUBKEY,
      tokenMetadataProgram: METADATA_PROGRAM_ID,
      // other necessary accounts...
    };

    // Prepare the instruction
    const instruction = await program.methods
      .buyTicket(ticketId)
      .accounts(accounts)
      .instruction();

    instructions.push(instruction);
    ticketInformation.push({
      ticketId,
      accounts,
    });
    ticketsSold++;
    maxTicketId++;
  }

  // Return the instruction for signing
  return {
    instructions,
    ticketInformation,
  };
}
