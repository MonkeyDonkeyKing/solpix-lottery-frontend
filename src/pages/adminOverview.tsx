/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import Banner from "@/components/Banner";
import Layout from "@/components/Layout";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../components/AdminOverview.module.css";
import { api } from "@/utils/api";
import { MessageV0, PublicKey, VersionedTransaction } from "@solana/web3.js";



const AdminOverview: NextPage = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

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
  const drawWinnersMutation = api.lottery.drawWinners.useMutation();
  const verifyWinnersMutation = api.lottery.verifyWinners.useMutation();


  if (!isAdmin) {
    // NOT ALLOWED
    return (
      <>
        <Head>
          <title>Admin Overview</title>
          <meta name="description" content="Solpix NexDraw" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <p>Please log in with the required wallet to access this page.</p>
        </Layout>
      </>
    );
  }

  async function drawWinners(lottery: PublicKey) {
    try {
      const instruction = await drawWinnersMutation.mutateAsync({
        admin: publicKey?.toBase58() ?? "",
        lottery: lottery.toString(),
      });
      const messagev0 = MessageV0.deserialize(instruction);
      const transaction = new VersionedTransaction(messagev0);
      console.log("transaction: ", transaction);

      const txid = await sendTransaction(transaction, connection, {
        skipPreflight: true,
      });

      console.log("Drawing Winners txid: ", txid);
    } catch (error) {
      console.log(error);
    }
  }

  function ticketPriceReadable(price: string) {
    return parseInt(price, 16) / 1000000000;
  }

  // ALLOWED
  return (
    <>
      <Head>
        <title>Admin Overview</title>
        <meta name="description" content="Solpix NexDraw" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Banner
          heading="Admin Overview"
          paragraph="Create new NexDraw concepts, add prizes and go live- also check ongoing events"
        />
        <section className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>NexDraw ID</th>
                <th>Price pool</th>
                <th>Ticket price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lotteryData.data?.sort((a, b) => a.account.lotteryId - b.account.lotteryId).map(({ account, publicKey }, index) => (
                <tr key={index}>
                  <td><Link href={`/lotteries/${publicKey}`}>NexDraw ID:  {account.lotteryId}</Link></td>
                  <td>
                    {(ticketPriceReadable(account.ticketPrice.sol?.value as string) * account.ticketsSold).toFixed(2)} <span>SOL</span>
                  </td>
                  <td>
                    {ticketPriceReadable(account.ticketPrice.sol?.value as string)}{" "}
                    <span>SOL</span>
                  </td>
                  <td>{Object.keys(account.lotteryStatus)[0]}</td>

                  <td>
                    {Object.keys(account.lotteryStatus)[0] === "concepting" ? (
                      <Link
                        legacyBehavior
                        href={`/adminAddPrizes?lotterPublicKey=${publicKey}`}
                      >
                        add prizes
                      </Link>
                    ) : Object.keys(account.lotteryStatus)[0] === "live" ? (
                      <button onClick={() => drawWinners(publicKey)}>Draw Winners</button>
                    ) : (
                      "No actions"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className={styles.container}>
          <Link href={"/adminCreate"} className={styles.link}>Create NexDraw Concept</Link>
        </div>
      </Layout>
    </>
  );
};

export default AdminOverview;
