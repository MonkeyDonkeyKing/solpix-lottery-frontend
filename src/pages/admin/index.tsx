import Layout from "@/components/Layout";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Admin: NextPage = () => {
  const router = useRouter();
  const currentPageUri = router.pathname;
  return (
    <>
      <Head>
        <title>Admin</title>
        <meta name="description" content="Solpix Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section>
          <h1>Functionalities</h1>
          <button
            onClick={() => router.push(`${currentPageUri}/createLottery`)}
          >
            Add new lottery master
          </button>
        </section>{" "}
      </Layout>
    </>
  );
};

export default Admin;
