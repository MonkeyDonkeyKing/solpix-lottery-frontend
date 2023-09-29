import Layout from "@/components/Layout";
import NFTCard from "@/components/NFTCard";
import { useState, useEffect, ChangeEventHandler } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  Keypair,
  MessageV0,
  PublicKey,
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
import { RouterInputs, api } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";
import PrizeCard from "@/components/PrizeCard";

type method = Methods<"addNftPrize">;
type lotteryInput = RouterInputs["lottery"]["addNftPrice"];

const AdminAddPrizes: NextPage = () => {
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [nfts, setNfts] = useState<Metadata[]>([]);
  const [nftsLottery, setNftsLottery] = useState<Metadata[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const addNFTPrize = api.lottery.addNftPrice.useMutation();
  const addSolPrize = api.lottery.addPoolPrize.useMutation();
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

  const router = useRouter();
  const lotteryPublicKey = router.query.lotterPublicKey as string;

  const [userNfts, lotteryNfts] = api.useQueries((t) => [
    t.fetching.fetchAddressNfts(
      { address: publicKey!.toBase58() },
      { enabled: false }
    ),
    t.fetching.fetchAddressNfts(
      { address: lotteryPublicKey },
      { enabled: false }
    ),
  ]);

  const lotteryData = api.lottery.getLotteryData.useQuery(
    {
      lottery: lotteryPublicKey,
    },
    {
      enabled: isAdmin,
      select(data) {
        userNfts.refetch();
        lotteryNfts.refetch();
        return data;
      },
    }
  );

  const handleNFTSelect = (address: string) => {
    setSelectedNFT(address);
  };

  const addPrize = async () => {
    if (inputPrice > 100 || inputPrice <= 0) return;
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
    } catch (error) {
      console.log(error);
    }
  };

  const removePrize = (index: number) => {
    const updatedPrizes = [...solanaPrizesTable];
    updatedPrizes.splice(index, 1);
    setSolanaPrizesTable(updatedPrizes);
  };

  function handleSolPriceInput(e) {
    setInputPrice(Number(e.target.value));
  }

  function onGoLive() {
    console.log();
  }

  async function addNFTPrizeToLottery() {
    try {
      const instruction = await addNFTPrize.mutateAsync({
        authority: publicKey?.toBase58() ?? "",
        lottery: lotteryPublicKey,
        mint: selectedNFT!,
      });
      const messagev0 = MessageV0.deserialize(instruction);
      const transaction = new VersionedTransaction(messagev0);
      console.log("transaction: ", transaction);
      const txid = await sendTransaction!(transaction, connection, {
        skipPreflight: true,
      });
      console.log("txid: ", txid);
    } catch (error) {
      console.log(error);
    }
  }

  // async function addSOLPrizesToLottery(prize: number) {
  //   try {

  //       const instruction = await addSolPrize.mutateAsync({
  //         authority: publicKey?.toBase58() ?? "",
  //         lottery: lotteryPublicKey,
  //         value: prize
  //       });

  //       const messagev0 = MessageV0.deserialize(instruction);
  //       const transaction = new VersionedTransaction(messagev0);
  //       const txid = await sendTransaction!(transaction, connection, {
  //         skipPreflight: true,
  //       });

  //       console.log(`Transaction for ${prize}% completed. TXID: ${txid}`);

  //     setError(null);
  //   } catch (error) {
  //     setError((error.message) as string);
  //   }
  // }

  // NOT ALLOWED
  if (!isAdmin) {
    return (
      <>
        <Head>
          <title>Admin add prizes</title>
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
        <title>Admin add prizes</title>
        <meta name="description" content="Solpix Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Banner heading="Create Lottery" paragraph="Create a new lottery" />
        <section className={styles.formContainer3}>
          <div>
            <p>Lottery ID: {lotteryData.data?.lotteryId}</p>
            <p>Max Tickets for sale: {lotteryData.data?.maxTicketsForSale}</p>
            <p>
              Ticket Price:{" "}
              {parseInt(lotteryData.data?.ticketPrice.sol?.value, 16) /
                1000000000}{" "}
              SOL
            </p>
            {/* <p>Status: {lotteryData.data?.lotteryStatus.concepting}</p> */}
          </div>
        </section>
        <div className={styles.wrapper}>
          <section className={styles.nftcontainer}>
            <h3>Your Wallet</h3>
            {nfts.map((nft, index) => (
              <NFTCard
                key={index}
                nft={nft}
                isSelected={selectedNFT === nft?.mintAddress.toBase58()}
                onSelect={handleNFTSelect}
              />
            ))}
          </section>
          <section className={styles.nftcontainer}>
            <h3>Lottery Wallet</h3>
            {nftsLottery.map((nft, index) => (
              <NFTCard key={index} nft={nft} />
            ))}
            {solanaPrizesTable.map((price, index) => (
              <PrizeCard
                key={index}
                price={price}
                onRemove={() => removePrize(index)}
              />
            ))}
          </section>

          <section className={styles.formContainer2}>
            <div className={styles.addsolprice}>
              <p>
                Add % to calculate prizes from the prize pool. Prizes must add
                up to 100 %
              </p>
              <input
                type="number"
                min={1}
                max={100}
                value={inputPrice}
                onChange={handleSolPriceInput}
              />
              <button onClick={() => addPrize(inputPrice)}>Add % Price</button>
            </div>
          </section>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        <section className={styles.actions}>
          <button disabled={!selectedNFT} onClick={addNFTPrizeToLottery}>
            Add NFT to lottery
          </button>
          {/* <button onClick={() => addSOLPrizesToLottery(solanaPrizesTable)}>
            Add SOL prizes to lottery
          </button> */}
          <button onClick={onGoLive}>GO LIVE</button>
        </section>

        <div className={styles.container}>
          <Link href={"/adminOverview"}>Back to overview</Link>
        </div>
      </Layout>
    </>
  );
};

export default AdminAddPrizes;
