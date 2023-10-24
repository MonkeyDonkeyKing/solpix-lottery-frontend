/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import Head from "next/head";

import Layout from "@/components/Layout";
import CardMain from "@/components/CardMain";

import * as web3 from "@solana/web3.js";
import { api } from "@/utils/api";

import Banner from "@/components/Banner";
import InfoSection from "@/components/InfoSection";
import React from "react";



const Home: NextPage = () => {
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

  const hexToReadableDate = (hexTime: string) => {
    const unixTime = parseInt(hexTime, 16) * 1000; 
    const date = new Date(unixTime);
    return date; 
  };

  return (
    <>
      <Head>
        <title>NexDraw</title>
        <meta name="description" content="NexDraw" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Banner
          imageUrl="https://res.cloudinary.com/dew0rdkok/image/upload/v1686065840/Home_yrhfqt.jpg"
          imageAlt="Solpix Banner"
          heading="NexDraw"
          paragraph="built by Solpix, an exclusive DAO dedicated to the empowerment of the Solana community"
        />
        {lotteryData.data?.filter(item => Object.keys(item.account.lotteryStatus)[0] === 'live').filter(
          (lottery) =>
            hexToReadableDate(lottery.account.lotteryType.time?.endTime as string) > new Date()
        ).map(({ account, publicKey }, index) => (
          <CardMain key={index} address={publicKey} lotteryData={account} />
        ))}
        <InfoSection></InfoSection>
      </Layout>
    </>
  );
};

export default Home;
