import Banner from "@/components/Banner";
import Layout from "@/components/Layout";
import { useWallet } from "@solana/wallet-adapter-react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../components/AdminOverview.module.css";
import { useState } from "react";
import { api } from "@/utils/api";
import { PublicKey } from "@solana/web3.js";

const allowedWallets = [
  "6fMUyugMke8TaRCtj7w8WW4g6Jp1KYe9TabQJCujxeJr",
  "95ZwCRFtSNLKrbGz1WAbmxxYT1d4GY4SGTizfAKSi9by",
  "1adTuNaAAm1Neyz6LdNFG5sfQJC3cMjMQ1J9cz5pVhY",
];

type LotteryOverviewProps = {
  lotteryID: string;
  pricePool: number;
  creatorFee: number;
  status: "ongoing" | "finished";
};


const AdminOverview: NextPage = () => {
  const { publicKey } = useWallet();
  const lotteryData = api.lottery.getLotteriesByAdmin.useQuery(
    {
      admin: publicKey?.toBase58()!,
    },
    {
      enabled: !!publicKey,
    }
  );
  const isAdmin = api.lottery.isAdmin.useQuery(
    {
      admin: publicKey?.toBase58()!,
    },
    {
      enabled: !!publicKey,
    }
  );
  const isAllowedWallet = lotteryData.isSuccess && lotteryData.data.length > 0;

  if (!isAllowedWallet) {
    // NOT ALLOWED
    return (
      <>
        <Head>
          <title>Admin Overview</title>
          <meta name="description" content="Solpix Lottery" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <p>Please log in with the required wallet to access this page.</p>
        </Layout>
      </>
    );
  }
  console.log(lotteryData?.data[0]?.account.ticketPrice);

  // ALLOWED
  return (
    <>
      <Head>
        <title>Admin Overview</title>
        <meta name="description" content="Solpix Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Banner
          heading="Admin Overview"
          paragraph="Create new lotteries and check ongoing ones"
        />
        <section className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Lottery ID</th>
                <th>Price pool</th>
                <th>Ticket price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lotteryData.data.map(({ account, publicKey }, index) => (
                <tr key={index}>
                  {/* lottery ID */}
                  <td>{account.lotteryId}</td>
                  <td>
                    {0} <span>SOL</span>
                  </td>
                  <td>
                    { parseInt(account.ticketPrice.sol?.value, 16) / 1000000000 } <span>SOL</span>
                  </td>
                  <td>{JSON.stringify(account.lotteryStatus)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className={styles.container}>
          <Link href={"/adminCreate"}>Create Lottery Concept</Link>
        </div>
      </Layout>
    </>
  );
};

export default AdminOverview;
