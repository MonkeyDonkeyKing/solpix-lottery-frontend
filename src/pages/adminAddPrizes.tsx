import Layout from "@/components/Layout";
import NFTCard from "@/components/NFTCard";
import { useState, useEffect } from "react";
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


  const lotteryData = api.lottery.getLotteryData.useQuery(
    {
      lottery: lotteryPublicKey
    }
  );

  useEffect(() => {
    if (isAdmin) {
      fetchNFTs();
      fetchNFTsForLottery();
    }
  }, [isAdmin]);

  const fetchJsonData = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const jsonData: { image: string; name: string } = await response.json();
      return jsonData;
    } catch (error) {
      console.error("Error fetching JSON data:", error);
      return null;
    }
  };

  const fetchNFTs = async () => {
    try {
      if (!publicKey) return;

      const connection = new Connection(clusterApiUrl("devnet"));
      const wallet = Keypair.generate();

      const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(wallet))
        .use(bundlrStorage());

      const nfts = (await metaplex
        .nfts()
        .findAllByOwner({ owner: publicKey })) as Metadata[];

      // Extract JSON and address from NFT metadata
      const nftDataPromises = nfts.map(async (nft) => {
        const { uri, mintAddress } = nft;

        const jsonData = await fetchJsonData(uri);

        if (jsonData) {
          const { image, name } = jsonData;
          return { mintAddress, image, name, uri };
        }

        return null;
      });

      const nftData = await Promise.all(nftDataPromises);

      const filteredNftData = nftData.filter(
        (data): data is any => data !== null
      );
      setNfts(filteredNftData);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  const fetchNFTsForLottery = async () => {
    try {
      const metaplex = Metaplex.make(connection);
      const mintAddresses = lotteryData.data?.prizes.map(
        (prize) => new PublicKey(prize.nft!.mint as string)
      );
      console.log("HIERHIERHIER",mintAddresses)
      const nftDataPromises = mintAddresses!.map(async (mintAddress, index) => {
        const nft = await metaplex.nfts().findByMint({ mintAddress });
        const uri = nft.uri;
        const jsonData = await fetchJsonData(uri);

        if (jsonData) {
          const { image, name } = jsonData;
          return { mintAddress, image, name, uri };
        }
        return null;
      });

      const nftData = await Promise.all(nftDataPromises);

      const filteredNftData = nftData.filter(
        (data): data is any => data !== null
      );
      setNftsLottery(filteredNftData);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  const handleNFTSelect = (address: string) => {
    setSelectedNFT(address);
  };

  const removeSolPrice = (index: number) => {
    solanaPrizesTable.splice(index, 1);
    setSolanaPrizesTable([...solanaPrizesTable]);
  };

  const addSolPrice = () => {
    if (inputPrice > 100 || inputPrice <= 0) return;
    setSolanaPrizesTable([...solanaPrizesTable, inputPrice]);
  };

  function handleSolPriceInput(e: any) {
    setInputPrice(e.target.value);
  }

  function onGoLive() {
    console.log();

  }

  async function addNFTPrizeToLottery() {
    try {

      const instruction = await addNFTPrize.mutateAsync({
        authority: publicKey?.toBase58() ?? "",
        lottery: lotteryPublicKey,
        mint: selectedNFT!
      });
      const messagev0 = MessageV0.deserialize(instruction);
      const transaction = new VersionedTransaction(messagev0);
      console.log("transaction: ", transaction);
      const txid = await sendTransaction!(transaction, connection, {
        skipPreflight: true,
      });
      console.log("txid: ", txid);
    }
    catch (error) {
      console.log(error);
    }
  }

  async function addSOLPrizesToLottery(prizes: number[]) {
    try {
      const totalPrize = prizes.reduce((sum, prize) => sum + prize, 0);
  
      if (totalPrize !== 100) {
        throw new Error("Prizes must add up to 100%");
      }
  
      for (const prize of prizes) {
        const instruction = await addSolPrize.mutateAsync({
          authority: publicKey?.toBase58() ?? "",
          lottery: lotteryPublicKey,
          value: prize
        });
  
        const messagev0 = MessageV0.deserialize(instruction);
        const transaction = new VersionedTransaction(messagev0);
        const txid = await sendTransaction!(transaction, connection, {
          skipPreflight: true,
        });
  
        console.log(`Transaction for ${prize}% completed. TXID: ${txid}`);
      }
  
      setError(null);
    } catch (error) {
      setError((error.message) as string);
    }
  }

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
            <p>Ticket Price: {parseInt(lotteryData.data?.ticketPrice.sol?.value, 16) /
              1000000000}{" "} SOL</p>
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
              <NFTCard
                key={index}
                nft={nft}
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
              <button onClick={() => addSolPrice()}>Add % Price</button>
            </div>
            <section className={styles.table}>
              <table>
                <thead>
                  <tr>
                    <th>Solana Price</th>
                  </tr>
                </thead>
                <tbody>
                  {solanaPrizesTable.map((price, index) => (
                    <tr key={index}>
                      <td>
                        {price} <span> %</span>
                      </td>
                      <td>
                        <button onClick={() => removeSolPrice(index)}>X</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </section>
        </div>

          {error && <div className={styles.error}>{error}</div>}
        <section className={styles.actions}>
          <button disabled={!selectedNFT} onClick={addNFTPrizeToLottery}>
            Add NFT to lottery
          </button>
          <button onClick={() => addSOLPrizesToLottery(solanaPrizesTable)}>
            Add SOL prizes to lottery
          </button>
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
