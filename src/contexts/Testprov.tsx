"use client";

import React, { useMemo, type FC } from "react";
import {
  SolanaMobileWalletAdapter,
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
} from "@solana-mobile/wallet-adapter-mobile";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

type WalletAdapterProps = {
  children: React.ReactNode;
};

export const WalletAdapterProvider: FC<WalletAdapterProps> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network =
    process.env.NEXT_PUBLIC_CLIENT_NETWORK === "mainnet-beta"
      ? WalletAdapterNetwork.Mainnet
      : WalletAdapterNetwork.Devnet;
  console.log(network);

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(
    () =>
      network === WalletAdapterNetwork.Mainnet
        ? process.env.NEXT_PUBLIC_CLIENT_NETWORK_URL
        : "https://methodical-alien-diamond.solana-mainnet.quiknode.pro/915c906e06afd5bad621a099696d66253b38028a/", // Replace with your custom RPC endpoint URL
    [network]
  );
  console.log("endpoint", endpoint);
  const wallets = useMemo(
    () => [
      new SolanaMobileWalletAdapter({
        onWalletNotFound: async () => {
          return alert("Wallet not found");
        },
        addressSelector: createDefaultAddressSelector(),
        appIdentity: { name: "Solana Next.js Starter App" },
        cluster: network,
        authorizationResultCache: createDefaultAuthorizationResultCache(),
      }),
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint as string}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
