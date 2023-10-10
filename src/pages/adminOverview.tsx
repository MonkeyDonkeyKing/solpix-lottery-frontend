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


  if (!isAdmin) {
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

  // const drawWinners = await methods.lottery.drawWinners({
  //   lottery: new PublicKey(createLottery.accounts.lottery!),
  //   program,
  // });

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

      console.log("txid: ", txid);
    } catch (error) {
      console.log(error);
    }
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
                <th>Ticket price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lotteryData.data?.map(({ account, publicKey }, index) => (
                <tr key={index}>
                  <td>{account.lotteryId}</td>
                  <td>
                    {0} <span>SOL</span>
                  </td>
                  <td>
                    {parseInt(account.ticketPrice.sol?.value, 16) / 1000000000}{" "}
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
          <Link href={"/adminCreate"} className={styles.link}>Create Lottery Concept</Link>
        </div>
      </Layout>
    </>
  );
};

export default AdminOverview;
