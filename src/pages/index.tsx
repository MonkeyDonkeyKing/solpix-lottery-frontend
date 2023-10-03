/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import Head from "next/head";

import Layout from "@/components/Layout";
import CardMain from "@/components/CardMain";

///CHECK
import * as web3 from "@solana/web3.js";
import { api } from "@/utils/api";

import Banner from "@/components/Banner";
import InfoSection from "@/components/InfoSection";
import React from "react";

interface CreateLotteryArgs {
  distribution: number;
  endTime: number;
  numberOfTickets: number;
  possibleWinners: number;
  ticketPrice: number;
}

// const lotteryArgs: CreateLotteryArgs = {
//   distribution: 0.5,
//   endTime: Math.floor(new Date().getTime() / 1000) + 7200,
//   numberOfTickets: 200,
//   possibleWinners: 10,
//   ticketPrice: 1000000000,
// };
///

const Home: NextPage = () => {
  const [date, setDate] = React.useState(new Date());
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

  // const testData = {
  //   name: "Big Bad Bonanza",
  //   associatedLotteryMaster: "string",
  //   id: 1,
  //   numberOfTickets: 150,
  //   ticketPrice: "1000000",
  //   possibleWinners: 3,
  //   distribution: "test",
  //   winners: [
  //     {
  //       ticketId: 123456,
  //       priceClaimed: false,
  //     },
  //   ],
  //   endTime: "2023-10-10T23:59:59.999Z",
  //   nextTicketId: 15,
  //   solPrizes: [20, 30, 40, 50, 60],
  //   nfts: [
  //     {
  //       name: "Nft# 1",
  //       image:
  //         "https://cvps3ivzzq2rrksudc57cswvbydhhdg4lm7tf6osgtjinza4g4ya.arweave.net/FV8tornMNRiqVBi78UrVDgZzjNxbPzL50jTShuQcNzA?ext=png",
  //     },
  //     {
  //       name: "Nft# 2",
  //       image:
  //         "https://cvps3ivzzq2rrksudc57cswvbydhhdg4lm7tf6osgtjinza4g4ya.arweave.net/FV8tornMNRiqVBi78UrVDgZzjNxbPzL50jTShuQcNzA?ext=png",
  //     },
  //   ],
  // } as any;

  return (
    <>
      <Head>
        <title>Lottery Home</title>
        <meta name="description" content="Solpix Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Banner
          imageUrl="https://res.cloudinary.com/dew0rdkok/image/upload/v1686065840/Home_yrhfqt.jpg"
          imageAlt="Solpix Banner"
          heading="Solana Lottery"
          paragraph="built by Solpix, an exclusive DAO dedicated to the empowerment of the Solana community"
        />
        {lotteryData.data?.map(({ account, publicKey }, index) => (
          <CardMain key={index} address={publicKey} lotteryData={account} />
        ))}

        <InfoSection></InfoSection>
      </Layout>
    </>
  );
};

export default Home;
