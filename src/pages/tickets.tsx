import Layout from "@/components/Layout";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../components/TicketPage.module.css";
import Banner from "@/components/Banner";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { api } from "@/utils/api";
import { web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";



const TicketPage: NextPage = () => {
  const { publicKey } = useWallet();
  const [mintAddresses, setMintAddresses] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [lotteryIDs, setLotteryIDs] = useState<string[]>([]);
  const [winningTickets, setWinningTickets] = useState<any[][]>([]);

  
  const userNfts = api.fetching.fetchAddressNfts.useQuery(
   {
    address: publicKey!.toBase58()
   }
   
  );
  const lotteryData = api.lottery.getAllLotteries.useQuery(
    {},
    {
      select(data) {
        return data.map(({ account, publicKey }) => ({
          account: {
            ...account,
            associatedLotteryManager: new web3.PublicKey(
              account.associatedLotteryManager
            ),
          },
          publicKey: new web3.PublicKey(publicKey),
        }));
      },
    }
  );

  const getWinningTickets = () => {
    const winningTicketsData: { lotteryID: string; tickets: { ticketId: number, claimed: boolean }[] }[] = [];

    lotteryData.data?.forEach(item => {
      const { account } = item;
      if (account?.lotteryId && account.winningTickets) {
        winningTicketsData.push({
          lotteryID: account.lotteryId.toString(),
          tickets: account.winningTickets.map(ticketId => {
            const claimed = winningTicketsData.find(wt => wt.lotteryID === account.lotteryId.toString())
              ?.tickets.find(t => t.ticketId === ticketId)?.claimed;

            return {
              ticketId,
              claimed,
            };
          }),
        });
      }
    });

    return winningTicketsData;
  };

  const winningTicketsData = getWinningTickets();
  const filteredTickets = winningTicketsData.filter(winningTicket =>
    mintAddresses.some(mintAddress =>
      winningTicket.tickets.includes(mintAddress)
    )
  );


  useEffect(() => {
    if (userNfts.data) {
      const mintAddresses = userNfts.data.map(nft => nft.mintAddress);
      const names = userNfts.data.map(nft => nft.name);
      setMintAddresses(mintAddresses);
      setNames(names);
    }
  }, []);
  
  useEffect(() => {
    if (lotteryData.data) {
      const lotteryIDsTemp = lotteryData.data.map(item => item.account.lotteryId.toString());
      const winningTickets = lotteryData.data.map(item => item.account.winningTickets);
      setLotteryIDs(lotteryIDsTemp);
      setWinningTickets(winningTickets);
    }
  }, []);

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
          paragraph="Your Ticket Playground: Manage, Claim, and Reap Crypto Rewards!"
        />
        {publicKey && (
          <div className={styles.ticketsSection}>
            <table className={styles.ticketTable}>
              <thead>
                <tr>
                  <th>Lottery ID</th>
                  <th>Ticket ID</th>
                  <th>Claimed</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket, index) => (
                  <tr key={index}>
                    <td>{ticket.lotteryID}</td>
                    <td>{ticket.tickets.join(', ')}</td>
                    <td>{ticket.tickets[index]?.claimed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {publicKey && mintAddresses.length > 0 && names.length > 0 && (
          <div className={styles.nftData}>
            <h2>Your NFT Data</h2>
            <ul>
              {mintAddresses.map((address, index) => (
                <li key={index}>
                  Mint Address: {address}, Name: {names[index]}
                </li>
              ))}
            </ul>
          </div>
        )}

        {lotteryIDs.length > 0 && winningTickets.length > 0 && (
          <div className={styles.lotteryData}>
            <h2>Lottery Data</h2>
            <ul>
              {lotteryIDs.map((key, index) => (
                <li key={index}>
                  Lottery ID: {key}, Winning Tickets: {winningTickets[index].join(', ')}
                </li>
              ))}
            </ul>
          </div>
             )}
        {!publicKey && 
          <h3>Please connect your wallet first</h3>
        }
        <div className={styles.container}>
          <Link href={"/"}>Back to overview</Link>
        </div>
      </Layout>
    </>
  );
};

export default TicketPage;
