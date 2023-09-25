import Layout from "@/components/Layout";
import NFTCard from "@/components/NFTCard";
import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  Keypair,
  MessageV0,
  TransactionMessage,
  VersionedMessage,
  VersionedTransaction,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  Metadata,
  Metaplex,
  bundlrStorage,
  keypairIdentity,
} from "@metaplex-foundation/js";
import Head from "next/head";
import { NextPage } from "next";
import styles from "../components/AdminCreate.module.css";
import Banner from "@/components/Banner";
import { Methods } from "@/lottery-program-build/utilityTypes";
import { InstructionParams } from "@/lottery-program-build";
import { RouterInputs, api } from "@/utils/api";
import { AppRouter } from "@/server/api/root";
import Link from "next/link";

const allowedWallets = [
  "6fMUyugMke8TaRCtj7w8WW4g6Jp1KYe9TabQJCujxeJr",
  "95ZwCRFtSNLKrbGz1WAbmxxYT1d4GY4SGTizfAKSi9by",
  "1adTuNaAAm1Neyz6LdNFG5sfQJC3cMjMQ1J9cz5pVhY",
  "FPk6H2qX3a4iEuUZ4M7CUH9KkHKaaqn2wEhuvj9wK6kd",
  "FUCKA33Mw3KjZBENMkwNVuXdHhcecAyMvnhNzfwx7DqU",
];

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
  const [nfts, setNfts] = useState<Metadata[]>([]);
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);
  const isAllowedWallet =
    publicKey && allowedWallets.includes(publicKey.toBase58());
  const [creatorFee, setCreatorFee] = useState<number>(0);
  const [ticketPrice, setTicketPrice] = useState<number>(0);
  const [solanaPrices, setSolanaPrices] = useState<number[]>([]);
  const [inputPrice, setInputPrice] = useState<number>(0);
  const [maxTicketAmount, setMaxTicketAmount] = useState<number>(0);
  const [minTicketAmount, setMinTicketAmount] = useState<number>(0);
  const [endDate, setEndDate] = useState<string>(Date.now().toString());
  const [useDate, setUseDate] = useState<"time" | "capped">("capped");
  const [creatorFeeWallet, setCreatorFeeWallet] = useState<string>("");
  const [params, setParams] = useState<InstructionParams<method>>();



  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateFormatted = maxDate.toISOString().split("T")[0];

  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];

  const handleSubmit = async () => {
    const type =
      useDate === "time"
        ? {
            time: {
              endTime: new Date(endDate),
              requiredMinTicketsSold: minTicketAmount,
            },
          }
        : {
            capped: {
              autoAnnounceWinnersAfter: new Date(endDate),
            },
          };
    console.log(type);
    const instruction = await initLottery.mutateAsync({
      lotteryManagerPublicKey: publicKey?.toBase58() || "",
      params: {
        LotteryType: {
          ...type,
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


  function handleSolPriceInput(e: any) {
    setInputPrice(e.target.value);
  }

  const handleSwitch = () => {
    if (useDate === "time") {
      setUseDate("capped");
    } else {
      setUseDate("time");
    }
  };

  // NOT ALLOWED
  if (!isAllowedWallet) {
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
              <div className={styles.switchwrapper}>
                <p>What kind of lottery?</p>
                <div className={styles.switchDesc}>
                  <p>Ends after amount of tickets sold</p>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={useDate === "time"}
                      onChange={handleSwitch}
                    />
                    <span className={styles.slider}></span>
                  </label>
                  <p>Ends at a certain date</p>
                </div>
              </div>

              <div className={styles.initialinput}>
                {useDate === "capped" ? (
                  <p>Finish lottery on certain date if all tickets are sold</p>
                ) : (
                  <p>When should the lottery end?</p>
                )}
                <input
                  id="start"
                  type="date"
                  value={endDate}
                  min={todayFormatted}
                  max={maxDateFormatted}
                  onChange={(e) => setEndDate(e.target.value)}
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
              {useDate === "time" && (
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
              )}
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
                    {minTicketAmount * ticketPrice} SOL -{" "}
                    {maxTicketAmount * ticketPrice} SOL
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
          <Link href={"/adminOverview"}>Back to overview</Link>
        </div>
      </Layout>
    </>
  );
};

export default AdminCreate;
