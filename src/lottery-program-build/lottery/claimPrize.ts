import { type PublicKey } from "@solana/web3.js";
import { type AccountParams, type Methods } from "../utilityTypes";
import { type SolpixLottery } from "@/lottery-program-build/types/0.1.0/solpix_lottery";
import type * as anchor from "@coral-xyz/anchor";
import { lotteryPdas } from "../pdas";
import { Metaplex } from "@metaplex-foundation/js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

type method = Methods<"claimPrize">;

export default async function claimPrize({
  address,
  lotteryAddress,
  program,
}: {
  address: PublicKey;
  lotteryAddress: PublicKey;
  program: anchor.Program<SolpixLottery>;
}) {
  const [lotteryPdaAuthority] = lotteryPdas.getAuthorityPda(lotteryAddress);
  const [collectionMint] = lotteryPdas.getLotteryMint(lotteryAddress);
  const [lotteryPrizeVault] = lotteryPdas.getPrizeVaultPda(lotteryAddress);
  const mplx = Metaplex.make(program.provider.connection);
  const signerNfts = await mplx.nfts().findAllByOwner({
    owner: address,
  });
  const lotteryData = await program.account.lottery.fetch(lotteryAddress);
  const winnerTicketAddresses = lotteryData.winningTickets.map((ticket) => {
    return {
      ticketId: ticket.ticketId,
      address: lotteryPdas.getLotteryTicketMint(
        lotteryAddress,
        ticket.ticketId
      )[0],
    };
  });
  const prizeArray = [...lotteryData.prizes];
  const winningTicketsByOwner = signerNfts
    // filter all the collections that are verified and are the same as the lottery
    .filter(
      (nft) =>
        nft.collection?.verified &&
        nft.collection.address.equals(collectionMint)
    )
    // grab the public keys of the mint addresses
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .map((nft) => nft.mintAddress as PublicKey)
    // filter the mint addresses that are in the winning tickets
    .filter((mint) =>
      winnerTicketAddresses.some(({ address }) => address.equals(mint))
    )
    // map the winning tickets to the prize array
    .map((mint) => {
      const ticket = winnerTicketAddresses.find(({ address }) =>
        address.equals(mint)
      );
      const indexof = lotteryData.winningTickets.findIndex(
        (index) => ticket?.ticketId === index.ticketId
      );
      // the index of the ticket in the winning tickets array is the same as the index of the prize in the prize array
      const prize = prizeArray[indexof];

      return {
        ...ticket,
        prize: prize,
      };
    });

  const instructions: anchor.web3.TransactionInstruction[] = [];

  for await (const ticket of winningTicketsByOwner) {
    if (!ticket) return;
    const accounts: AccountParams<method> = {
      lottery: lotteryAddress,
      lotteryPdaAuthority,
      lotteryTicketMint: ticket.address,
      prizeMint: ticket.prize?.nft ? ticket.prize.nft.mint : null,
      prizeVault: lotteryPrizeVault,
      receiverAta: ticket.prize?.nft
        ? getAssociatedTokenAddressSync(ticket.prize.nft.mint, address)
        : null,
      senderAta: ticket.prize?.nft
        ? getAssociatedTokenAddressSync(
            ticket.prize.nft.mint,
            lotteryPrizeVault
          )
        : null,
      signer: address,
    };
    const claimPrizeIx = await program.methods
      .claimPrize(ticket.ticketId!)
      .accounts(accounts)
      .instruction();

    instructions.push(claimPrizeIx);
  }
  return {
    instructions,
    winningTicketsByOwner,
  };
}
