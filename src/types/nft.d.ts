import { PublicKey } from "@metaplex-foundation/js";

declare module "@metaplex-foundation/js" {
  interface Metadata {
    mintAddress: PublicKey;
  }

  interface Nft {
    mintAddress: PublicKey;
  }

  interface Sft {
    mintAddress: PublicKey;
  }
}
