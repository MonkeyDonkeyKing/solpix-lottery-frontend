/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import Layout from "@/components/Layout";
import NFTCard from "@/components/NFTCard";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  MessageV0,
  PublicKey,
  VersionedTransaction,
} from "@solana/web3.js";
import Head from "next/head";
import { NextPage } from "next";
import styles from "../components/AdminAddPrize.module.css";
import Banner from "@/components/Banner";
import Link from "next/link";
import { useRouter } from "next/router";
import PrizeCard from "@/components/PrizeCard";
import { env } from "@/env.mjs";
import { api } from "@/utils/api";

const AdminAddPrizes: NextPage = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const addNFTPrize = api.lottery.addNftPrice.useMutation();
  const addSolPrize = api.lottery.addPoolPrize.useMutation();
  const startLottery = api.lottery.startLottery.useMutation();
  const { data: isAdmin } = api.lottery.isAdmin.useQuery(
    {
      admin: publicKey?.toBase58()!,
    },
    {
      enabled: !!publicKey,
    }
  );
  const [solanaPrizesTable, setSolanaPrizesTable] = useState<number[]>([]);
  const [inputPrice, setInputPrice] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const router = useRouter();
  const lotteryPublicKey = router.query.lotterPublicKey as string;

  const resetTransactionStatus = () => {
    setTimeout(() => {
      setTransactionStatus('idle');
    }, 5000);
  };

  const hexToReadableDate = (hexTime: string) => {
    const unixTime = parseInt(hexTime, 16) * 1000;
    const date = new Date(unixTime);
    return date.toLocaleString();
  };

  const [userNfts, lotteryNfts] = api.useQueries((t) => [
    t.fetching.fetchAddressNfts(
      { address: publicKey!.toBase58() }
      // { enabled: false }
    ),
    t.fetching.fetchAddressNfts(
      {
        address: getPrizeVaultPda(
          new PublicKey(lotteryPublicKey)
        )[0].toBase58(),
      }
      // { enabled: false }
    ),
  ]);

  const lotteryData = api.lottery.getLotteryData.useQuery(
    {
      lottery: lotteryPublicKey,
    },
    {
      enabled: isAdmin,
      select(data) {
        // userNfts.refetch();
        // lotteryNfts.refetch();
        return data;
      },
    }
  );

  const handleNFTSelect = (address: string) => {
    setSelectedNFT(address);
  };

  const addPrize = async () => {
    if (inputPrice > 100 || inputPrice <= 0) return;
    setTransactionStatus('idle');
    try {
      const instruction = await addSolPrize.mutateAsync({
        authority: publicKey?.toBase58() ?? "",
        lottery: lotteryPublicKey,
        value: inputPrice,
      });
      const messagev0 = MessageV0.deserialize(instruction);
      const transaction = new VersionedTransaction(messagev0);
      const txid = await sendTransaction(transaction, connection, {
        skipPreflight: true,
      });

      console.log(`Transaction for ${inputPrice}% completed. TXID: ${txid}`);
      setSolanaPrizesTable([...solanaPrizesTable, inputPrice]);
      setTransactionStatus('success');
      resetTransactionStatus();
    } catch (error) {
      console.log(error);
      setTransactionStatus('error');
      resetTransactionStatus();
    }
  };

  const removePrize = (index: number) => {
    const updatedPrizes = [...solanaPrizesTable];
    updatedPrizes.splice(index, 1);
    setSolanaPrizesTable(updatedPrizes);
  };

  function handleSolPriceInput(e: { target: { value: string; }; }) {
    setInputPrice(Number(e.target.value));
  }

  async function onGoLive() {
    setTransactionStatus('idle');
    try {
      const instruction = await startLottery.mutateAsync({
        authority: publicKey?.toBase58() ?? "",
        lottery: lotteryPublicKey,
        symbol: 'NXDRW',
        name: `NexDraw ID: ${lotteryData.data?.lotteryId}`,
        uri: 'https://ipfs.io/ipfs/bafkreibavp3ud47wyte5c73mb7fynieczuyjp43uy4kclwwblu4lpiq3lq/'
      });
      const messagev0 = MessageV0.deserialize(instruction);
      const transaction = new VersionedTransaction(messagev0);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const txid = await sendTransaction!(transaction, connection, {
        skipPreflight: true,
      });

      console.log(`Transaction for Go LIVE completed. TXID: ${txid}`);
      setTransactionStatus('success');
      resetTransactionStatus();
    } catch (error) {
      console.log(error);
      setTransactionStatus('error');
      resetTransactionStatus();
    }
  }

  async function addNFTPrizeToLottery() {
    setTransactionStatus('idle');
    try {
      const instruction = await addNFTPrize.mutateAsync({
        authority: publicKey?.toBase58() ?? "",
        lottery: lotteryPublicKey,
        mint: selectedNFT!,
      });
      const messagev0 = MessageV0.deserialize(instruction);
      const transaction = new VersionedTransaction(messagev0);
      console.log("transaction: ", transaction);
      const txid = await sendTransaction(transaction, connection, {
        skipPreflight: true,
      });
      console.log("txid: ", txid);
      setTransactionStatus('success');
      resetTransactionStatus();
    } catch (error) {
      console.log(error);
      setTransactionStatus('error');
      resetTransactionStatus();
    }
  }

  // NOT ALLOWED
  if (!isAdmin) {
    return (
      <>
        <Head>
          <title>Admin add prizes</title>
          <meta name="description" content="Solpix NexDraw" />
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
        <title>Admin add prizes</title>
        <meta name="description" content="Solpix NexDraw" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Banner heading="Add prizes to the concept" paragraph="Add prizes and go live with the event" />
        {transactionStatus === 'success' && (
              <div className={styles.messageSuccess}>Transaction Successful</div>
            )}
            {transactionStatus === 'error' && (
              <div className={styles.messageError}>Transaction Failed</div>
            )}
        <div className={styles.toprow}>
        <section className={`${styles.formContainer3} ${transactionStatus === 'success' ? styles.success : transactionStatus === 'error' ? styles.error : ''}`}>
            <div >
              <p>NexDraw ID: {lotteryData.data?.lotteryId}</p>
              <p>Max Tickets for sale: {lotteryData.data?.maxTicketsForSale}</p>
              <p>
                Ticket Price:{" "}
                {parseInt(lotteryData.data?.ticketPrice.sol?.value as string, 16) /
                  1000000000}{" "}
                SOL
              </p>
              <p>Min Tickets: {lotteryData.data?.lotteryType.time?.requiredMinTicketsSold}</p>
              <p>EndTime: {hexToReadableDate(lotteryData.data?.lotteryType.time?.endTime as string)}</p>
            </div>
          </section>
          <section className={`${styles.formContainer2} ${transactionStatus === 'success' ? styles.success : transactionStatus === 'error' ? styles.error : ''}`}>
            
            <div className={styles.addsolprice}>
              <p>
                Add % to calculate prizes from the prize pool.
              </p>
              <input
                type="number"
                min={1}
                max={100}
                value={inputPrice}
                onChange={handleSolPriceInput}
              />
              <button onClick={() => addPrize()}>Add % Price</button>
            </div>
          </section>

        </div>
        <div className={styles.wrapper}>
          <section className={`${styles.nftcontainer} ${transactionStatus === 'success' ? styles.success : transactionStatus === 'error' ? styles.error : ''}`}>
            <h3>Your Wallet</h3>
            <div className={styles.nftcontainerNoBorder}>
              {userNfts.data?.map((nft, index) => (
                <NFTCard
                  key={index}
                  nft={nft}
                  isSelected={selectedNFT === nft?.mintAddress}
                  onSelect={handleNFTSelect}
                />
              ))}
            </div>
          </section>
          <section className={styles.nftcontainer}>
            <h3>NexDraw Wallet</h3>
            <div className={styles.nftcontainerNoBorder}>
              {lotteryNfts.data?.map((nft, index) => (
                <NFTCard key={index} nft={nft} />
              ))}
              {lotteryData.data?.prizes.map((price, index) => {
                if (price.pool)
                  return (
                    <PrizeCard
                      key={index}
                      price={price.pool.value}
                    />
                  );
              })}
            </div>
          </section>
        </div>

        <section className={styles.actions}>
          <button disabled={!selectedNFT} onClick={addNFTPrizeToLottery}>
            Add NFT to NexDraw
          </button>
          {/* <button onClick={() => addSOLPrizesToLottery(solanaPrizesTable)}>
            Add SOL prizes to lottery
          </button> */}
          <button onClick={onGoLive}>GO LIVE</button>
        </section>

        <div className={styles.container}>
          <Link href={"/adminOverview"} className={styles.link}>Back to overview</Link>
        </div>
      </Layout>
    </>
  );
};

export default AdminAddPrizes;

const getPrizeVaultPda = (lottery: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("lottery"),
      LOTTERY_PROGRAM_ID.toBuffer(),
      lottery.toBuffer(),
      Buffer.from("vault"),
    ],
    LOTTERY_PROGRAM_ID
  );
};

export const LOTTERY_PROGRAM_ID = new PublicKey(
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  env.NEXT_PUBLIC_LOTTERY_PROGRAM_ID!
);
