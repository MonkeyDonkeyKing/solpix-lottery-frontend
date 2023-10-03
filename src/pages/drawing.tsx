import React, { useState } from "react";
import Layout from "@/components/Layout";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/components/DrawingPage.module.css";
import Banner from "@/components/Banner";
import CardDrawing from "@/components/CardDrawing";
import { web3 } from "@coral-xyz/anchor";
import Link from "next/link";
import { api } from "@/utils/api";

const Drawing: NextPage = () => {
  const [sortingOption, setSortingOption] = useState<
    "all" | "current" | "previous"
  >("all");

  const lotteryData = api.lottery.getAllLotteries.useQuery(
    {},
    {
      select(data) {
        return data.map(({ account, publicKey }) => ({
          account: {
            ...account,
            associatedLotteryManager: new web3.PublicKey(
              account.associatedLotteryManager
            ),
          },
          publicKey: new web3.PublicKey(publicKey),
        }));
      },
    }
  );
  const hexToReadableDate = (hexTime) => {
    const unixTime = parseInt(hexTime, 16) * 1000; 
    const date = new Date(unixTime);
    return date; 
  };


  const filteredLotteries =
    sortingOption === "all"
      ? lotteryData.data
      : sortingOption === "current"
        ? lotteryData.data?.filter(
          (lottery) =>
            hexToReadableDate(lottery.account.lotteryType.time?.endTime) > new Date()
        )
        : lotteryData.data?.filter(
          (lottery) =>
            hexToReadableDate(lottery.account.lotteryType.time?.endTime) <= new Date()
        );

  return (
    <>
      <Head>
        <title>Lottery Drawing</title>
        <meta name="description" content="Solpix Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Banner heading="Upcoming Lotteries" paragraph="Unleash Your Inner Crypto Maverick: Dive into the Hottest Upcoming Lotteries!" />
        <div className={styles.sortButtons}>
          <button
            onClick={() => setSortingOption("all")}
            className={sortingOption === "all" ? styles.active : ""}
            style={{ textTransform: "uppercase" }}
          >
            All
          </button>
          <span> | </span>
          <button
            onClick={() => setSortingOption("current")}
            className={sortingOption === "current" ? styles.active : ""}
            style={{ textTransform: "uppercase" }}
          >
            Current
          </button>
          <span> | </span>
          <button
            onClick={() => setSortingOption("previous")}
            className={sortingOption === "previous" ? styles.active : ""}
            style={{ textTransform: "uppercase" }}
          >
            Previous
          </button>
        </div>
        <div className={styles.cardcontainer}>
          {filteredLotteries?.filter(item => Object.keys(item.account.lotteryStatus)[0] === 'live').map(({ account, publicKey }, index) => (
            <CardDrawing key={index} lotteryData={account} />
          ))}
        </div>
        <div className={styles.container}>
          <Link href={"/"}>Back to overview</Link>
        </div>
      </Layout>
    </>
  );
};

export default Drawing;
