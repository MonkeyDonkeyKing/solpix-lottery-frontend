import Banner from "@/components/Banner";
import Layout from "@/components/Layout";
import { api } from "@/utils/api";
import { PublicKey } from "@solana/web3.js";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../components/LotteryDetails.module.css";


const LotteryDetails: NextPage = () => {
  const router = useRouter();
  const key = new PublicKey(router.query.lottery as string);
  if (!key) return <p>Invalid solana address</p>;
  if (PublicKey.isOnCurve(key)) return <p>Not a PDA</p>;
  
    const lotteryData = api.lottery.getLotteryData.useQuery({
    lottery: key.toBase58(),
  });

  const hexToReadableDate = (hexTime) => {
    const unixTime = parseInt(hexTime, 16) * 1000; // Convert to milliseconds
    const date = new Date(unixTime);
    return date.toLocaleString(); // Customize the date format as needed
  };
  return (
    <>
      <Head>
        <title>Lottery Details</title>
        <meta name="description" content="Solpix Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
      <Banner heading="Lottery Details" paragraph="Check out if you won and claim your prize & rent" />
      <section className={styles.container}>
          <div >
            <p>Lottery ID: {lotteryData.data?.lotteryId}</p>
            <p>Max Tickets for sale: {lotteryData.data?.maxTicketsForSale}</p>
            <p>
              Ticket Price:{" "}
              {parseInt(lotteryData.data?.ticketPrice.sol?.value, 16) /
                1000000000}{" "}
              SOL
            </p>
            <p>Min Tickets: {lotteryData.data?.lotteryType.time?.requiredMinTicketsSold}</p>
            <p>EndTime: {hexToReadableDate(lotteryData.data?.lotteryType.time?.endTime)}</p>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default LotteryDetails;
