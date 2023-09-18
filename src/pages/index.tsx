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
  // const handler = api.lottery.initializeLottery.useQuery({
  //   lotteryManagerPublicKey: "95ZwCRFtSNLKrbGz1WAbmxxYT1d4GY4SGTizfAKSi9by",
  //   params: {
  //     LotteryType: {
  //       capped: {
  //         autoAnnounceWinnersAfter: date,
  //       },
  //     },
  //     maxTicketsForSale: 100,
  //     ticketPrice: 0.1,
  //   },
  // });
  // async function createTx() {
  //   if (!publicKey) return;
  //   console.log(await connection.getBalance(publicKey));
  //   const tx = await create_lottery({
  //     accounts: {
  //       user: publicKey,
  //     },
  //     lotteryArgs,
  //     program,
  //   });
  //   const message = new web3.TransactionMessage({
  //     instructions: tx.instructions,
  //     recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
  //     payerKey: publicKey,
  //   }).compileToV0Message();
  //   let transaction = new web3.VersionedTransaction(message);
  //   transaction = await signTransaction!(transaction);
  //   const txId = await connection.sendTransaction(transaction);
  //   const blockhash = await connection.getLatestBlockhashAndContext();
  //   const confirmedTx = await connection.confirmTransaction({
  //     blockhash: blockhash.value.blockhash,
  //     lastValidBlockHeight: blockhash.value.lastValidBlockHeight,
  //     minContextSlot: blockhash.context.slot,
  //     signature: txId,
  //   });
  //   if (confirmedTx.value.err) {
  //     throw new Error(`${confirmedTx.value.err}`);
  //   }
  //   console.log("transaction succesfull: ", txId);
  //   return txId;
  // }
  // async function assignSelfAsMaster() {
  //   if (!publicKey) throw new Error("no public key connected");
  //   setMaster.mutate({
  //     assignee: publicKey?.toBase58(),
  //   });
  // }

  const testData = {
    name: "Big Bad Bonanza",
    associatedLotteryMaster: "string",
    id: 1,
    numberOfTickets: 150,
    ticketPrice: "1000000",
    possibleWinners: 3,
    distribution: "test",
    winners: [
      {
        ticketId: 123456,
        priceClaimed: false,
      },
    ],
    endTime: "2023-10-10T23:59:59.999Z",
    nextTicketId: 15,
    solPrizes: [20, 30, 40, 50, 60],
    nfts: [
      {
        name: "Nft# 1",
        image:
          "https://cvps3ivzzq2rrksudc57cswvbydhhdg4lm7tf6osgtjinza4g4ya.arweave.net/FV8tornMNRiqVBi78UrVDgZzjNxbPzL50jTShuQcNzA?ext=png",
      },
      {
        name: "Nft# 2",
        image:
          "https://cvps3ivzzq2rrksudc57cswvbydhhdg4lm7tf6osgtjinza4g4ya.arweave.net/FV8tornMNRiqVBi78UrVDgZzjNxbPzL50jTShuQcNzA?ext=png",
      },
    ],
  } as any;

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
        <CardMain
          address={
            new web3.PublicKey("HEYAeTSbf6ojSoMatSoG8HSLmgC2berjphRrSd4XUyf8")
          }
          lotteryData={testData}
        />
        <CardMain
          address={
            new web3.PublicKey("HEYAeTSbf6ojSoMatSoG8HSLmgC2berjphRrSd4XUyf8")
          }
          lotteryData={testData}
        />
        <CardMain
          address={
            new web3.PublicKey("HEYAeTSbf6ojSoMatSoG8HSLmgC2berjphRrSd4XUyf8")
          }
          lotteryData={testData}
        />
        {/* {lotteries.data?.map((lottery) => (
          <CardMain
            key={lottery.publicKey.toString()}
            address={new web3.PublicKey(lottery.publicKey)}
            lotteryData={lottery.account}
          />
        ))} */}
        <InfoSection></InfoSection>
      </Layout>
    </>
  );
};

export default Home;
