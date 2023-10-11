import Layout from "@/components/Layout";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  MessageV0,
  VersionedTransaction,
} from "@solana/web3.js";
import Head from "next/head";
import { NextPage } from "next";
import styles from "../components/AdminCreate.module.css";
import Banner from "@/components/Banner";
import { Methods } from "@/lottery-program-build/utilityTypes";
import { RouterInputs, api } from "@/utils/api";
import Link from "next/link";

type method = Methods<"initializeLottery">;
type lotteryInput = RouterInputs["lottery"]["initializeLottery"]["params"];

const AdminCreate: NextPage = () => {
  const initLottery = api.lottery.initializeLottery.useMutation();
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const { data: isAdmin } = api.lottery.isAdmin.useQuery(
    {
      admin: publicKey?.toBase58()!,
    },
    {
      enabled: !!publicKey,
    }
  );
  const { connection } = useConnection();

  const [ticketPrice, setTicketPrice] = useState<number>(0);
  const [maxTicketAmount, setMaxTicketAmount] = useState<number>(0);
  const [minTicketAmount, setMinTicketAmount] = useState<number>(0);
  const [endDateTime, setEndDateTime] = useState<string>(
    new Date().toISOString().split('T')[0] + 'T12:00' // Default date and time
  );
  const [useDate, setUseDate] = useState<"time" | "capped">("time");

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateFormatted = maxDate.toISOString().split("T")[0];

  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];

  const handleSubmit = async () => {

    const instruction = await initLottery.mutateAsync({
      lotteryManagerPublicKey: publicKey?.toBase58() ?? "",
      params: {
        LotteryType: {
          time: {
            endTime: new Date(endDateTime),
            requiredMinTicketsSold: minTicketAmount,
          },
        },
        maxTicketsForSale: maxTicketAmount,
        ticketPrice: ticketPrice,
      },
    });
    const messagev0 = MessageV0.deserialize(instruction);
    const transaction = new VersionedTransaction(messagev0);
    console.log("transaction: ", transaction);
    const txid = await sendTransaction!(transaction, connection, {
      skipPreflight: true,
    });
    console.log("txid: ", txid);
  };



  // NOT ALLOWED
  if (!isAdmin) {
    return (
      <>
        <Head>
          <title>Admin Create</title>
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
        <title>Admin Create</title>
        <meta name="description" content="Solpix Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Banner heading="Create Lottery Concept" paragraph="Create a new lottery" />
        <div className={styles.wrapper}>
          <section className={styles.formContainer}>
            <div className={styles.initialinput}>
              <div className={styles.initialinput}>

                <p>When should the lottery end?</p>

                <input
                  type="datetime-local"
                  value={endDateTime}
                  min={todayFormatted + 'T00:00'} // Minimum date and time
                  max={maxDateFormatted + 'T23:59'} // Maximum date and time
                  onChange={(e) => setEndDateTime(e.target.value)}
                />
              </div>

              <div className={styles.initialinput}>
                <p>How many tickets should there be to sell?</p>
                <input
                  type="number"
                  min={10}
                  max={10000}
                  value={maxTicketAmount}
                  onChange={(e) => setMaxTicketAmount(Number(e.target.value))}
                />
              </div>

              <div className={styles.initialinput}>
                <p>Whats the minimum of tickets that need to be sold?</p>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={minTicketAmount}
                  onChange={(e) => setMinTicketAmount(Number(e.target.value))}
                />
              </div>

            </div>

            <div className={styles.inputSections}>
              <p>Ticket price: {ticketPrice}</p>
              <input
                type="number"
                min={0}
                step={0.1}
                placeholder="How much does a ticket cost?"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
              />
            </div>
            {useDate === "time" && (
              <div className={styles.inputSections}>
                <p>
                  The lottery pool will be between{" "}
                  <p className={styles.boldText}>
                    {(minTicketAmount * ticketPrice).toFixed(2)} SOL -{" "}
                    {(maxTicketAmount * ticketPrice).toFixed(2)} SOL
                  </p>
                </p>
              </div>
            )}
          </section>
        </div>
        <section className={styles.actions}>
          <button onClick={handleSubmit}>Create lottery concept</button>
        </section>
        <div className={styles.container}>
          <Link href={"/adminOverview"} className={styles.link}>Back to overview</Link>
        </div>
      </Layout>
    </>
  );
};

export default AdminCreate;
