import Banner from "@/components/Banner";
import Layout from "@/components/Layout";
import { api } from "@/utils/api";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { MessageV0, PublicKey, VersionedTransaction } from "@solana/web3.js";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../components/LotteryDetails.module.css";
import { useState } from "react";
import PrizeIcon from "@/components/PrizeIcon";

const LotteryDetails: NextPage = () => {
  const router = useRouter();
  const { publicKey: userkey, sendTransaction } = useWallet();
  const lotteryAdress = router.query.lottery;
  const { connection } = useConnection();
  const [value, setValue] = useState(0);
  const buyTicket = api.lottery.buyTicket.useMutation();

  console.log(lotteryAdress);
  console.log(userkey);
  const key = new PublicKey(lotteryAdress as string);

  const keyOnCurve = PublicKey.isOnCurve(lotteryAdress as string);
  const lotteryData = api.lottery.getLotteryData.useQuery({
    lottery: key.toBase58(),
  });

  const tickets = api.lottery.getLotteryTicketsByUser.useQuery(
    {
      lotteryAddress: key.toBase58(),
      userAddress: userkey?.toBase58() || "",
    },
    {
      enabled: !!userkey,
    }
  );

  console.log(lotteryAdress);

  if (!userkey) return <h2>Please connect your wallet first</h2>;

  if (PublicKey.isOnCurve(key)) return <p>Not a PDA</p>;

  const hexToReadableString = (hexTime: string) => {
    const unixTime = parseInt(hexTime, 16) * 1000;
    const date = new Date(unixTime);
    return date.toLocaleString();
  };

  const hexToReadableDate = (hexTime: string) => {
    const unixTime = parseInt(hexTime, 16) * 1000;
    const date = new Date(unixTime);
    return date;
  };

  const endTime = hexToReadableDate(
    lotteryData.data?.lotteryType.time?.endTime as string
  );

  const isEndTimePassed = Date.now() >= endTime.getTime();

  const bannerHeading = `NexDraw ID: ${lotteryData.data?.lotteryId}`;
  const prizes = lotteryData.data?.prizes;

  const buyTickets = async () => {
    try {
      const instruction = await buyTicket.mutateAsync({
        buyer: userkey.toBase58() ?? "",
        lottery: key.toBase58(),
        quantity: +value,
      });
      const messagev0 = MessageV0.deserialize(instruction);
      const transaction = new VersionedTransaction(messagev0);
      const txid = await sendTransaction(transaction, connection, {
        skipPreflight: true,
      });

      console.log(
        `Transaction for lottery address: ${key.toBase58()}% completed. TXID: ${txid}
        Bought ${value} tickets for ${(
          (value *
            parseInt(lotteryData.data?.ticketPrice.sol?.value as string, 16)) /
          1000000000
        ).toFixed(2)} SOL`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue((prevValue) => Number(e.target.value));
  };

  const ticketPrice =
    parseInt(lotteryData.data?.ticketPrice.sol?.value as string, 16) /
    1000000000;

  const handleWatchDrawing = () => {
    void router.push({
      pathname: "/drawingDetail",
      query: {
        id: lotteryData.data?.lotteryId,
        endTime: lotteryData.data?.lotteryType.time?.endTime,
        numberOfTicketsSold: lotteryData.data.ticketsSold,
        numberOfTickets: lotteryData.data.maxTicketsForSale,
        ticketPrice: ticketPrice,
        lotteryPublicKey: key.toBase58(),
      },
    });
  };

  return (
    <>
      <Head>
        <title>NexDraw Event Details</title>
        <meta name="description" content="Solpix NexDraw" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Banner
          heading={bannerHeading}
          paragraph="Check out if you won and claim your prize & rent"
        />
        <div className={styles.gridwrapper}>
          <section className={styles.container}>
            <div>
              <h3>NexDraw ID: {lotteryData.data?.lotteryId}</h3>
              {lotteryData.data?.lotteryStatus && (
                <p>
                  NexDraw Event Status:{" "}
                  {Object.keys(lotteryData.data?.lotteryStatus)}
                </p>
              )}
              <p>Max Tickets for sale: {lotteryData.data?.maxTicketsForSale}</p>
              <p>Tickets sold: {lotteryData.data?.ticketsSold}</p>
              <p>Ticket Price: {ticketPrice} SOL</p>
              <p>
                Min Tickets:{" "}
                {lotteryData.data?.lotteryType.time?.requiredMinTicketsSold}
              </p>
              <p>
                EndTime:{" "}
                {hexToReadableString(
                  lotteryData.data?.lotteryType.time?.endTime as string
                )}
              </p>
            </div>
          </section>
          <section className={styles.container}>
            <h3>Want to buy some more tickets?</h3>
            <div className={styles.buysection}>
              <input
                type="number"
                value={value}
                min={0}
                max={3}
                onChange={handleInputChange}
              />
              <button onClick={() => setValue(1)}>1</button>
              <button onClick={() => setValue(2)}>2</button>
              <button onClick={() => setValue(3)}>3</button>
            </div>
            <div className={styles.buybutton}>
              <button
                style={{ textTransform: "uppercase" }}
                onClick={buyTickets}
              >
                Buy for {(value * ticketPrice).toFixed(2)} SOL
              </button>
              <h3>Want to watch the drawing?</h3>
              {lotteryData.data?.lotteryStatus &&
                Object.keys(lotteryData.data?.lotteryStatus)[0] ===
                  "drawing" && (
                  <button
                    style={{ textTransform: "uppercase" }}
                    disabled={!isEndTimePassed}
                    onClick={handleWatchDrawing}
                  >
                    Watch Drawing
                  </button>
                )}
              <PrizeIcon prizes={prizes} publicKey={key} />
            </div>
          </section>
          <section className={styles.container2}>
            <h3>Your tickets for this lottery:</h3>
            <section>
              {tickets.data?.map((ticket, index) => (
                <div key={index}>
                  <p>{ticket.mintAddress.toString()}</p>
                  <button disabled={!isEndTimePassed}>Redeem ticket</button>
                </div>
              ))}
            </section>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default LotteryDetails;
