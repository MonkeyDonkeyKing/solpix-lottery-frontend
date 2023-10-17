import Banner from "@/components/Banner";
import Layout from "@/components/Layout";
import { NextPage } from "next";
import Head from "next/head";
import styles from "../components/Collaberate.module.css";
import Link from "next/link";

const Collaborate: NextPage = () => {
  return (
    <>
      <Head>
        <title>NexDraw Collaborate</title>
        <meta name="description" content="Solpix NexDraw" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Banner
          heading="Collaborate"
          paragraph="We are always happy to work with other projects"
        />
        <div className={styles.collab}>
          <p>Feel free to ask us about collaboration via our channels</p>
        </div>
        <div className={styles.container}>
          <Link href={"/"}>Back to overview</Link>
        </div>
      </Layout>
    </>
  );
};

export default Collaborate;
