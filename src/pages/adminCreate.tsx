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
import { api } from "@/utils/api";

const allowedWallets = [
  "6fMUyugMke8TaRCtj7w8WW4g6Jp1KYe9TabQJCujxeJr",
  "95ZwCRFtSNLKrbGz1WAbmxxYT1d4GY4SGTizfAKSi9by",
  "1adTuNaAAm1Neyz6LdNFG5sfQJC3cMjMQ1J9cz5pVhY",
];

type method = Methods<"initializeLottery">;

const AdminCreate: NextPage = () => {
  const initLottery = api.lottery.initializeLottery.useMutation();
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [nfts, setNfts] = useState<Metadata[]>([]);
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);
  const isAllowedWallet =
    publicKey && allowedWallets.includes(publicKey.toBase58());
  const [creatorFee, setCreatorFee] = useState<number>(0);
  const [ticketPrice, setTicketPrice] = useState<number>(0);
  const [solanaPrices, setSolanaPrices] = useState<number[]>([]);
  const [inputPrice, setInputPrice] = useState<number>(0);
  const [ticketAmount, setTicketAmount] = useState<number>(0);
  const [endDate, setEndDate] = useState<string>(Date.now().toString());
  const [useDate, setUseDate] = useState<boolean>(false);
  const [creatorFeeWallet, setCreatorFeeWallet] = useState<string>("");
  const [params, setParams] = useState<InstructionParams<method>>();

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

  // Checks if Wallet is allowed
  useEffect(() => {
    if (isAllowedWallet) {
      fetchNFTs();
    }
  }, [isAllowedWallet]);

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

  const handleNFTSelect = (address: string) => {
    setSelectedNFTs((prevSelected) => {
      if (prevSelected.includes(address)) {
        return prevSelected.filter(
          (selectedAddress) => selectedAddress !== address
        );
      } else {
        return [...prevSelected, address];
      }
    });
  };

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateFormatted = maxDate.toISOString().split("T")[0];

  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!useDate) {
      setEndDate("Max Tickets");
    }
    const formData = {
      selectedNFTs,
      creatorFee,
      solanaPrices,
      endDate,
      ticketAmount,
      creatorFeeWallet,
    };
    console.log(formData);
    console.log("test: ", new Date(endDate));
    const type = useDate
      ? {
        time: {
          endTime: new Date(endDate),
          requiredMinTicketsSold: 1,
        },
      }
      : {
        capped: {
          autoAnnounceWinnersAfter: new Date(endDate),
        },
      };

    const instruction = await initLottery.mutateAsync({
      lotteryManagerPublicKey: publicKey?.toBase58() || "",
      params: {
        LotteryType: {
          ...type,
        },
        maxTicketsForSale: ticketAmount,
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

  const removeSolPrice = (index: number) => {
    solanaPrices.splice(index, 1);
    setSolanaPrices([...solanaPrices]);
  };

  const addSolPrice = () => {
    if (inputPrice > 100 || inputPrice <= 0) return;
    setSolanaPrices([...solanaPrices, inputPrice]);
  };

  function handleSolPriceInput(e: any) {
    setInputPrice(e.target.value);
  }

  const handleSwitch = () => {
    setTicketAmount(0);
    setUseDate(!useDate);
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
        <Banner heading="Create Lottery" paragraph="Create a new lottery" />
        <div className={styles.wrapper}>
          <section className={styles.nftcontainer}>
            {nfts.map((nft, index) => (
              <NFTCard
                key={index}
                nft={nft}
                isSelected={selectedNFTs.includes(
                  nft?.mintAddress.toBase58() || ""
                )}
                onSelect={handleNFTSelect}
              />
            ))}
          </section>
          <section className={styles.formContainer}>
            <div className={styles.initialinput}>
              <div className={styles.switchwrapper}>
                <p>Choose Input:</p>
                <div className={styles.switchDesc}>
                <p>Max Tickets</p>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={useDate}
                    onChange={handleSwitch}
                  />
                  <span className={styles.slider}></span>
                </label>
                <p>Pick Date</p>
                </div>
              </div>

              {useDate ? (
                <div className={styles.initialinput}>
                  <p>Enddate</p>
                  <input
                    id="start"
                    type="date"
                    value={endDate}
                    min={todayFormatted}
                    max={maxDateFormatted}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              ) : (
                <div className={styles.initialinput}>
                  <p>Maximum Tickets sold</p>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={ticketAmount}
                    onChange={(e) => setTicketAmount(Number(e.target.value))}
                  />
                </div>
              )}
            </div>
            
            <div className={styles.inputSections}>
              <p>Creator Fee: {creatorFee}%</p>
              <input
                type="range"
                min={0}
                max={100}
                value={creatorFee}
                onChange={(e) => setCreatorFee(Number(e.target.value))}
              />
            </div>
            <div className={styles.inputSections}>
              <p>Creator fee wallet: {creatorFeeWallet}</p>
              <input
                type="text"
                placeholder="Wallet that receives the creator fee"
                value={creatorFeeWallet}
                onChange={(e) => setCreatorFeeWallet(e.target.value)}
              />
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
          </section>
        </div>
        <section className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Solana Price</th>
              </tr>
            </thead>
            <tbody>
              {solanaPrices.map((price, index) => (
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
        <section className={styles.actions}>
          <button disabled={selectedNFTs.length == 0}>Add NFT(s)</button>
          <button onClick={handleSubmit}>Create Lottery</button>
        </section>
      </Layout>
    </>
  );
};

export default AdminCreate;
