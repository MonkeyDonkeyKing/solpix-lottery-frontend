import React, { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/components/DrawingPage.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import SlotCounter, { type SlotCounterRef } from "react-slot-counter";
import Banner from "@/components/Banner";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

interface Ticket {
  ticketID: string;
  value: number | string;
}

const DrawingDetail: NextPage = () => {
  const router = useRouter();
  const {
    id: queryId,
    endTime,
    numberOfTicketsSold,
    numberOfTickets,
    ticketPrice,
    lotteryPublicKey
  } = router.query;
  const lotteryId = queryId as string;
  const parsedNumberOfTicketsSold = Number(numberOfTicketsSold as string);
  const parsedNumberOfTickets = Number(numberOfTickets as string);
  const parsedTicketPrice = Number(ticketPrice as string);
  const prizePool = parsedTicketPrice * parsedNumberOfTicketsSold;


  const lotteryData = api.lottery.getLotteryData.useQuery({
    lottery: lotteryPublicKey as string,
  });
  const prizeArray = lotteryData.data?.prizes;
  const winnersArray = lotteryData.data?.winningTickets;

  const [ticketsWon, setTicketsWon] = useState<Ticket[]>([]);
  const [winningTicket, setWinningTicket] = useState<string>("001");
  const [availableWinners, setAvailableWinners] = useState<Ticket[]>([]);

  useEffect(() => {
    if (prizeArray && winnersArray) {
      const mergedArray = prizeArray.map((prize, index) => {
        const winner = winnersArray[index];
        if (prize.pool) {
          return {
            value: prize.pool.value,
            ticketID: winner?.ticketId ?? '',
          };
        } else if (prize.nft) {
          return {
            value: "NFT",
            ticketID: winner?.ticketId ?? '',
          };
        }
        return null;
      });
      setAvailableWinners(mergedArray.filter(Boolean) as Ticket[]);
    }
  }, [prizeArray, winnersArray]);

  const [winningAmount, setWinningAmount] = useState<number | string>(10);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isDrawingAll, setIsDrawingAll] = useState<boolean>(false);

  const slotWalletRef = useRef<SlotCounterRef>(null);
  const slotAmountRef = useRef<SlotCounterRef>(null);



  async function drawWinner() {
    if (availableWinners.length > 0) {
      setIsDrawing(true);
      slotWalletRef.current?.startAnimation({
        duration: 1.5,
        dummyCharacterCount: 15,
      });
      slotAmountRef.current?.startAnimation({
        duration: 1.5,
      });
      await getWinningTicket();
      setIsDrawing(false);
    }
  }

  // async function drawAllWinners() {
  //   if (availableWinners.length > 0) {
  //     var realLength = availableWinners.length;
  //     setIsDrawingAll(true);
  //     setIsDrawing(true);

  //     for (let index = 0; index < realLength; index++) {
  //       await drawWinner();
  //     }
  //   }
  // }

  async function getWinningTicket() {
    const winnerIndex = Math.floor(Math.random() * availableWinners.length);
    const winner = availableWinners[winnerIndex];

    setWinningTicket((winner?.ticketID)?.toString() ?? '');
    setWinningAmount(winner?.value ?? 0);

    await delay(2200);
    setTicketsWon([...ticketsWon, winner]);

    removeWinner(winner?.ticketID ?? '');
  }

  function removeWinner(ticketID: any) {
    const newWinners = availableWinners.filter(
      (ticket) => ticket.ticketID !== ticketID
    );
    setAvailableWinners(newWinners);
  }

  const handleViewDetails = () => {
    const publicKeyBase58 = lotteryPublicKey as string;
    void router.push(`/lotteries/${publicKeyBase58}`);
  };

  // const formatTicketOwningWallet = (wallet: string | undefined) => {
  //   if (wallet === undefined) {
  //     return "";
  //   }
  //   const firstFour = wallet.substring(0, 4);
  //   const lastFour = wallet.substring(wallet.length - 4);
  //   return `${firstFour}...${lastFour}`;
  // };

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const formatPricePool = (pricePool: number | null): string => {
    if (!pricePool) return "";
    return `${String(pricePool)} SOL`;
  };

  return (
    <>
      <Head>
        <title>Lottery Drawing</title>
        <meta name="description" content="Solpix Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Banner
          heading={"Lottery ID: " + lotteryId}
          subHeaderDraw="Epic Draw Event: Witness the Excitement Unfold!"
          id={lotteryId}
          prizePool={formatPricePool(prizePool)}
          maxTickets={parsedNumberOfTickets}
          soldTickets={parsedNumberOfTicketsSold}
        />

        <div className={styles.containerD}>
          <div className={styles.drawingColumn}>
            <p>Ticket ID</p>
            <SlotCounter
              value={winningTicket}
              dummyCharacters={"Solpix".split("")}
              ref={slotWalletRef}
              autoAnimationStart={false}
            />
          </div>
          <div className={styles.drawingColumn2}>
            <p>Prize</p>
            <SlotCounter
              value={winningAmount}
              ref={slotAmountRef}
              dummyCharacters={["0", "1", "2", "3", "4", "5"]}
              autoAnimationStart={false}
            />
          </div>

          <TableContainer component={Paper} className={styles.table}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    TICKET ID <span>PRIZE</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ticketsWon.map((owner, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {owner.ticketID}{" "}
                      <p>        {typeof owner.value === 'number'
                        ? `${owner.value}%`
                        : 'NFT'
                      }{" "}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className={styles.buttoncontainer}>
          <button
            className={styles.button}
            onClick={drawWinner}
            disabled={isDrawing || isDrawingAll || availableWinners?.length == 0}
          >
            Draw one
          </button>
          <button
            className={styles.button}
            style={{ textTransform: "uppercase" }}
            onClick={handleViewDetails}
          >
            View Details
          </button>
          {/* <button
            className={styles.button}
            onClick={drawAllWinners}
            disabled={isDrawingAll || isDrawing || availableWinners.length == 0}
          >
            Draw all
          </button> */}
        </div>
      </Layout>
    </>
  );
};

export default DrawingDetail;
