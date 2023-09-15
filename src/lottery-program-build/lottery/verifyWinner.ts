import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { SolpixLottery } from "@/lottery-program-build/types/0.1.0/solpix_lottery";
import type { AccountParams, Methods } from "../utilityTypes";
import { pdas } from "..";

type method = Methods<"verifyWinner">;

export default async function verifyWinner({
  program,
  lottery,
}: {
  program: anchor.Program<SolpixLottery>;
  lottery: PublicKey;
}) {
  const lotteryData = await program.account.lottery.fetch(lottery);
  const winners = lotteryData.winningTickets;

  const instructions: TransactionInstruction[] = [];
  const ticketInformation: {
    ticketId: number;
    accounts: AccountParams<method>;
  }[] = [];

  for await (const winner of winners) {
    const accounts: AccountParams<method> = {
      lottery,
      ticket: pdas.lotteryPdas.getLotteryTicketMint(
        lottery,
        winner.ticketId
      )[0],
    };

    // Prepare the instruction
    const instruction = await program.methods
      .verifyWinner()
      .accounts(accounts)
      .instruction();

    instructions.push(instruction);
    ticketInformation.push({
      ticketId: winner.ticketId,
      accounts,
    });
  }

  // Return the instruction for signing
  return {
    instructions,
    ticketInformation,
  };
}
