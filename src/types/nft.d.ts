import { PublicKey } from "@metaplex-foundation/js";

declare module "@metaplex-foundation/js" {
  interface Metadata {
    mintAddress: PublicKey;
    image: string;
    name: string;
    uri: string;
  }

  interface Nft {
    mintAddress: PublicKey;
  }

  interface Sft {
    mintAddress: PublicKey;
  }
}
