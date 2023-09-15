import { PublicKey } from "@metaplex-foundation/js";

declare module "metaplex-foundation/js" {
  interface NFT {
    mintAddress: PublicKey;
  }
}
