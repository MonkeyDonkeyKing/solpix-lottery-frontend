import Layout from "@/components/Layout";
import { api } from "@/utils/api";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const SuperAdmin: NextPage = () => {
  const router = useRouter();
  const currentPageUri = router.pathname;

  return (
    <>
      <Head>
        <title>Superadmin section</title>
        <meta name="description" content="Solpix NexDraw" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section>
          <h1>Functionalities</h1>
          <button onClick={() => router.push(`${currentPageUri}/assignMaster`)}>
            Add new lottery master
          </button>
        </section>
      </Layout>
    </>
  );
};

export default SuperAdmin;
