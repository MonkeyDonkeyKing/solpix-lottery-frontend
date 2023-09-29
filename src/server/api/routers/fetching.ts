import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PublicKey } from "@solana/web3.js";
import { Metadata, Metaplex } from "@metaplex-foundation/js";

export const fetchRouter = createTRPCRouter({
  fetchAddressNfts: publicProcedure
    .input(
      z.object({
        address: z.string().transform((key) => {
          return new PublicKey(key);
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      ctx.solanaRpc;
      const metaplex = Metaplex.make(ctx.solanaRpc);

      const nfts = (await metaplex
        .nfts()
        .findAllByOwner({ owner: input.address })) as Metadata[];

      // Extract JSON and address from NFT metadata
      const nftDataPromises = nfts.map(async (nft) => {
        const { uri, mintAddress } = nft;

        const jsonData = await fetchJsonData(uri);

        if (jsonData) {
          const { image, name } = jsonData;
          return { mintAddress, image, name, uri };
        }

        return null;
      });

      const nftData = await Promise.all(nftDataPromises);

      const filteredNftData = nftData.filter(
        (data): data is any => data !== null
      );
      return filteredNftData;
    }),
});

const fetchJsonData = async (uri: string) => {
  try {
    const response = await fetch(uri);
    const jsonData: { image: string; name: string } = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Error fetching JSON data:", error);
    return null;
  }
};
