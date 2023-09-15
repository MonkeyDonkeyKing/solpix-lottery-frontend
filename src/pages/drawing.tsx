import React, { useState } from "react";
import Layout from "@/components/Layout";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/components/DrawingPage.module.css";
import Banner from "@/components/Banner";
import CardDrawing from "@/components/CardDrawing";
import { drawingMockData } from "../utils/mockData";
import { web3 } from "@coral-xyz/anchor";
import Link from "next/link";

const Drawing: NextPage = () => {
  const [sortingOption, setSortingOption] = useState<
    "all" | "current" | "previous"
  >("all");

  const filteredLotteries =
    sortingOption === "all"
      ? drawingMockData
      : sortingOption === "current"
      ? drawingMockData.filter(
          (lotteryData) => new Date(lotteryData.endTime) > new Date()
        )
      : drawingMockData.filter(
          (lotteryData) => new Date(lotteryData.endTime) <= new Date()
        );

  return (
    <>
      <Head>
        <title>Lottery Drawing</title>
        <meta name="description" content="Solpix Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Banner heading="Upcoming Lotteries" paragraph="Lorem ipsum" />
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
          {filteredLotteries.map((lotteryData, index) => (
            <CardDrawing
              key={index}
              lotteryData={lotteryData}
              address={
                new web3.PublicKey(
                  "HEYAeTSbf6ojSoMatSoG8HSLmgC2berjphRrSd4XUyf8"
                )
              }
            />
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
