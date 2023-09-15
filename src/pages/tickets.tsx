import Layout from "@/components/Layout";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styles from "../components/TicketPage.module.css";
import Banner from "@/components/Banner";
import Link from "next/link";

type Ticket = {
  ticketID: string;
  lotteryID: string;
  pricePool: number;
  priceClaimed: boolean;
};

const TestTickets: Ticket[] = [
  {
    ticketID: "00000001",
    lotteryID: "001",
    pricePool: 200,
    priceClaimed: false,
  },
  {
    ticketID: "00000002",
    lotteryID: "001",
    pricePool: 200,
    priceClaimed: false,
  },
  {
    ticketID: "00000003",
    lotteryID: "001",
    pricePool: 200,
    priceClaimed: true,
  },
];

const TicketPage: NextPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>(TestTickets);

  return (
    <>
      <Head>
        <title>Lottery Tickets</title>
        <meta name="description" content="Solpix Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Banner
          heading="Your Tickets"
          paragraph="Here you can see your purchased tickets and claim your prize / get back ticket rent"
        />
        <div className={styles.ticketsSection}>
          <table className={styles.ticketTable}>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Lottery ID</th>
                <th>Price Pool</th>
                <th>Claim Price</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.ticketID}>
                  <td>{ticket.ticketID}</td>
                  <td>{ticket.lotteryID}</td>
                  <td>{ticket.pricePool}</td>
                  <td>
                    {ticket.priceClaimed ? (
                      <button className={styles.claimedButton} disabled>
                        Claim Price
                      </button>
                    ) : (
                      <button className={styles.claimButton}>
                        Claim Price
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.container}>
            <Link href={"/"}>Back to overview</Link>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default TicketPage;
