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

const LotteryDetails: NextPage = () => {
  const router = useRouter();
  const userkey = useWallet().publicKey!;

  if (!userkey) return <p>Not connected</p>;
  const key = new PublicKey(router.query.lottery as string);

  if (!key) return <p>Invalid solana address</p>;
  if (PublicKey.isOnCurve(key)) return <p>Not a PDA</p>;
  // needs to be here because react throws errors for misusage of hooks
  const user = useWallet();
  const { connection } = useConnection();
  const [value, setValue] = useState(0);
  const lotteryData = api.lottery.getLotteryData.useQuery({
    lottery: key.toBase58(),
  });

  const tickets = api.lottery.getLotteryTicketsByUser.useQuery({
    lotteryAddress: key.toBase58(),
    userAddress: userkey.toBase58(),
  });

  const hexToReadableDate = (hexTime: string) => {
    const unixTime = parseInt(hexTime, 16) * 1000;
    const date = new Date(unixTime);
    return date.toLocaleString();
  };
  const bannerHeading = `Lottery ID: ${lotteryData.data?.lotteryId}`;

  const buyTicket = api.lottery.buyTicket.useMutation();
  const buyTickets = async () => {
    try {
      const instruction = await buyTicket.mutateAsync({
        buyer: userkey.toBase58() ?? "",
        lottery: key.toBase58(),
        quantity: +value,
      });
      const messagev0 = MessageV0.deserialize(instruction);
      const transaction = new VersionedTransaction(messagev0);
      const txid = await user.sendTransaction(transaction, connection, {
        skipPreflight: true,
      });

      console.log(
        `Transaction for lottery address: ${key.toBase58()}% completed. TXID: ${txid}
        Bought ${value} tickets for ${(
          (value * parseInt(lotteryData.data?.ticketPrice.sol?.value, 16)) /
          1000000000
        ).toFixed(2)} SOL`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  return (
    <>
      <Head>
        <title>Lottery Details</title>
        <meta name="description" content="Solpix Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Banner
          heading={bannerHeading}
          paragraph="Check out if you won and claim your prize & rent"
        />
        <section className={styles.container}>
          <div>
            <h3 >Lottery ID: {lotteryData.data?.lotteryId}</h3>
            <p>Max Tickets for sale: {lotteryData.data?.maxTicketsForSale}</p>
            <p>Tickets sold: {lotteryData.data?.ticketsSold}</p>
            <p>
              Ticket Price:{" "}
              {parseInt(lotteryData.data?.ticketPrice.sol?.value as string, 16) /
                1000000000}{" "}
              SOL
            </p>
            <p>
              Min Tickets:{" "}
              {lotteryData.data?.lotteryType.time?.requiredMinTicketsSold}
            </p>
            <p>
              EndTime:{" "}
              {hexToReadableDate(lotteryData.data?.lotteryType.time?.endTime as string)}
            </p>
          </div>
          <h3>Wanna buy some more tickets?</h3>
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
              Buy for{" "}
              {(
                (value * parseInt(lotteryData.data?.ticketPrice.sol?.value, 16)) /
                1000000000
              ).toFixed(2)}{" "}
              SOL
            </button>
          </div>
        </section>
        <section className={styles.container}>
          <div>
            <h3>Your tickets for this lottery:</h3>
            <section>
              {tickets.data?.map((ticket, index) => {
                return (
                  <>
                    <div>
                      <p key={index}>{(ticket.mintAddress).toString()}</p>
                      <button key={index+1}>Claim ticket</button>
                    </div>
                  </>
                )
              })}
            </section>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default LotteryDetails;
