/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PublicKey } from "@solana/web3.js";
import { LOTTERY_PROGRAM_ID } from "./common";
import * as anchor from "@coral-xyz/anchor";
import { METADATA_PROGRAM_ID } from "./common";

const getLotteryPda = (lotteryManager: PublicKey, lotteryId: number) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("lottery"),
      LOTTERY_PROGRAM_ID.toBuffer(),
      lotteryManager.toBuffer(),
      new anchor.BN(lotteryId).toArrayLike(Buffer, "le", 4),
    ],
    LOTTERY_PROGRAM_ID
  );
};

const getLotteryManagerPda = (manager: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("lottery"),
      LOTTERY_PROGRAM_ID.toBuffer(),
      manager.toBuffer(),
      Buffer.from("manager"),
    ],
    LOTTERY_PROGRAM_ID
  );
};

const getProgramManagerPda = () => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("program"),
      LOTTERY_PROGRAM_ID.toBuffer(),
      Buffer.from("manager"),
    ],
    LOTTERY_PROGRAM_ID
  );
};
const getPrizeVaultPda = (lottery: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("lottery"),
      LOTTERY_PROGRAM_ID.toBuffer(),
      lottery.toBuffer(),
      Buffer.from("vault"),
    ],
    LOTTERY_PROGRAM_ID
  );
};
const getAuthorityPda = (lottery: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("lottery"),
      LOTTERY_PROGRAM_ID.toBuffer(),
      lottery.toBuffer(),
      Buffer.from("authority"),
    ],
    LOTTERY_PROGRAM_ID
  );
};
const getLotteryMint = (lottery: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("lottery"),
      LOTTERY_PROGRAM_ID.toBuffer(),
      lottery.toBuffer(),
      Buffer.from("mint"),
    ],
    LOTTERY_PROGRAM_ID
  );
};
const getLotteryTicketMint = (lottery: PublicKey, ticketId: number) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("lottery"),
      LOTTERY_PROGRAM_ID.toBuffer(),
      lottery.toBuffer(),
      new anchor.BN(ticketId).toArrayLike(Buffer, "le", 4),
      Buffer.from("ticket"),
      Buffer.from("mint"),
    ],
    LOTTERY_PROGRAM_ID
  );
};

//// Metaplex Pdas
const metadata = (mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    METADATA_PROGRAM_ID
  );
};

const masterEdition = (mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from("edition"),
    ],
    METADATA_PROGRAM_ID
  );
};
const lotteryPdas = {
  getLotteryPda,
  getLotteryManagerPda,
  getProgramManagerPda,
  getPrizeVaultPda,
  getAuthorityPda,
  getLotteryMint,
  getLotteryTicketMint,
};

const metaplexPdas = {
  metadata,
  masterEdition,
};

export { lotteryPdas, metaplexPdas };
