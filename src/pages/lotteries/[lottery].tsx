import Banner from "@/components/Banner";
import Layout from "@/components/Layout";
import { api } from "@/utils/api";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../components/LotteryDetails.module.css";

const LotteryDetails: NextPage = () => {
  const router = useRouter();
  const userkey = useWallet().publicKey!;

  if (!userkey) return <p>Not connected</p>;
  const key = new PublicKey(router.query.lottery as string);

  if (!key) return <p>Invalid solana address</p>;
  if (PublicKey.isOnCurve(key)) return <p>Not a PDA</p>;

  const lotteryData = api.lottery.getLotteryData.useQuery({
    lottery: key.toBase58(),
  });
  const tickets = api.lottery.getLotteryTicketsByUser.useQuery({
    lotteryAddress: key.toBase58(),
    userAddress: userkey.toBase58(),
  });
  console.log(tickets.data);

  const hexToReadableDate = (hexTime: string) => {
    const unixTime = parseInt(hexTime, 16) * 1000;
    const date = new Date(unixTime);
    return date.toLocaleString();
  };
  const bannerHeading = `Lottery ID: ${lotteryData.data?.lotteryId}`;
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
            <p>Lottery ID: {lotteryData.data?.lotteryId}</p>
            <p>Max Tickets for sale: {lotteryData.data?.maxTicketsForSale}</p>
            <p>Tickets sold: {lotteryData.data?.ticketsSold}</p>
            <p>
              Ticket Price:{" "}
              {parseInt(lotteryData.data?.ticketPrice.sol?.value, 16) /
                1000000000}{" "}
              SOL
            </p>
            <p>
              Min Tickets:{" "}
              {lotteryData.data?.lotteryType.time?.requiredMinTicketsSold}
            </p>
            <p>
              EndTime:{" "}
              {hexToReadableDate(lotteryData.data?.lotteryType.time?.endTime)}
            </p>
          </div>
        </section>
        <section className={styles.container}>
          <div>
            <p>Tickets:</p>
            {tickets.data?.map((ticket, index) => {
              return (<p key={index}>{ticket.address.toString()}</p>)
            })}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default LotteryDetails;
