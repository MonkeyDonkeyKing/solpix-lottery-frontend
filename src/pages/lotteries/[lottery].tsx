import Layout from "@/components/Layout";
import { api } from "@/utils/api";
import { PublicKey } from "@solana/web3.js";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const LotteryDetails: NextPage = () => {
  const router = useRouter();
  const key = new PublicKey(router.query.lottery as string);
  if (!key) return <p>Invalid solana address</p>;
  if (PublicKey.isOnCurve(key)) return <p>Not a PDA</p>;

  const lotteryData = api.lottery.getLotteryData.useQuery({
    lottery: key.toBase58(),
  });
  return (
    <>
      <Head>
        <title>Lottery Details</title>
        <meta name="description" content="Solpix Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div>{lotteryData.data?.lotteryId}</div>
        <div>{lotteryData.data?.maxTicketsForSale}</div>
        <div>{lotteryData.data?.ticketsSold}</div>
        <div>{lotteryData.data?.ticketPrice.sol?.value}</div>
      </Layout>
    </>
  );
};

export default LotteryDetails;
