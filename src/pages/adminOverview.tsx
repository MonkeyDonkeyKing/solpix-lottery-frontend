import Banner from "@/components/Banner";
import Layout from "@/components/Layout";
import { useWallet } from "@solana/wallet-adapter-react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../components/AdminOverview.module.css";
import { useState } from "react";

const allowedWallets = [
  "6fMUyugMke8TaRCtj7w8WW4g6Jp1KYe9TabQJCujxeJr",
  "YOUR_ALLOWED_WALLET_PUBLIC_KEY_2",
];

type LotteryOverviewProps = {
  lotteryID: string;
  pricePool: number;
  creatorFee: number;
  status: "ongoing" | "finished";
};

const TestLotteries: LotteryOverviewProps[] = [
  {
    lotteryID: "001",
    pricePool: 100,
    creatorFee: 10,
    status: "ongoing",
  },
  {
    lotteryID: "002",
    pricePool: 200,
    creatorFee: 20,
    status: "finished",
  },
  {
    lotteryID: "003",
    pricePool: 60,
    creatorFee: 1,
    status: "ongoing",
  },
];

const AdminOverview: NextPage = () => {
  const { publicKey } = useWallet();
  const [lotteries, setLotteries] =
    useState<LotteryOverviewProps[]>(TestLotteries);

  const isAllowedWallet =
    publicKey && allowedWallets.includes(publicKey.toBase58());

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
                <th>Creator fee</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lotteries.map((lottery, index) => (
                <tr key={index}>
                  <td>{lottery.lotteryID}</td>
                  <td>
                    {lottery.pricePool} <span>SOL</span>
                  </td>
                  <td>
                    {lottery.creatorFee} <span>SOL</span>
                  </td>
                  <td>{lottery.status}</td>
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
