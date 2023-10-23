/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@metaplex-foundation/js";
import { Program } from "@coral-xyz/anchor";
import { env } from "@/env.mjs";
import { IDL } from "@/lottery-program-build/types/0.1.0/solpix_lottery";

export const LOTTERY_PROGRAM_ID = new PublicKey(
  env.NEXT_PUBLIC_LOTTERY_PROGRAM_ID!
);

export const solanaRpc = new anchor.web3.Connection(env.SOLANA_NETWORK!);

export const program = new Program(IDL, LOTTERY_PROGRAM_ID, {
  connection: solanaRpc,
});

export const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
