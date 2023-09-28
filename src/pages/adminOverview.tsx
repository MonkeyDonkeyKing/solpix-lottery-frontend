import Banner from "@/components/Banner";
import Layout from "@/components/Layout";
import { useWallet } from "@solana/wallet-adapter-react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../components/AdminOverview.module.css";
import { api } from "@/utils/api";



const AdminOverview: NextPage = () => {
  const { publicKey } = useWallet();
  const lotteryData = api.lottery.getLotteriesByAdmin.useQuery(
    {
      admin: publicKey?.toBase58()!,
    },
    {
      enabled: !!publicKey,
    }
  );
  const isAdmin = api.lottery.isAdmin.useQuery(
    {
      admin: publicKey?.toBase58()!,
    },
    {
      enabled: !!publicKey,
    }
  );

  if (!isAdmin) {
    // NOT ALLOWED
    return (
      <>
        <Head>
          <title>Admin Overview</title>
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
        <title>Admin Overview</title>
        <meta name="description" content="Solpix Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Banner
          heading="Admin Overview"
          paragraph="Create new lotteries and check ongoing ones"
        />
        <section className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Lottery ID</th>
                <th>Price pool</th>
                <th>Ticket price</th>
                <th>Status</th>
                <th>Action</th> {/* New column for the button */}
              </tr>
            </thead>
            <tbody>
              {lotteryData.data?.map(({ account, publicKey }, index) => (
                <tr key={index}>
                  <td>{account.lotteryId}</td>
                  <td>
                    {0} <span>SOL</span>
                  </td>
                  <td>
                    {parseInt(account.ticketPrice.sol?.value, 16) /
                      1000000000}{" "}
                    <span>SOL</span>
                  </td>
                  <td>{JSON.stringify(account.lotteryStatus)}</td>
                  <td>
                    <Link legacyBehavior href={`/adminAddPrizes?lotteryId=${account.lotteryId}&pricePool=${0}&ticketPrice=${parseInt(
                      account.ticketPrice.sol?.value,
                      16
                    ) / 1000000000}&status=${JSON.stringify(
                      account.lotteryStatus
                    )}`}>add prizes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className={styles.container}>
          <Link href={"/adminCreate"}>Create Lottery Concept</Link>
        </div>
      </Layout>
    </>
  );
};

export default AdminOverview;
