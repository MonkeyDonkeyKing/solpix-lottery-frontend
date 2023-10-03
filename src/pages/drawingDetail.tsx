import React, { useState, useRef } from "react";
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

// For Testing: Will get 2 Arrays with Tickets / WinningTickets for the lottery
// Winner will then be drawn with an amount

interface Ticket {
  walletID: string;
  amount?: number;
}

const initialTickets: Ticket[] = [
  { walletID: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH" },
  { walletID: "24PNhTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR5p" },
  { walletID: "3333hTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR5p" },
  { walletID: "4433hTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR44" },
  { walletID: "5533hTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR55" },
  { walletID: "6633hTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR66" },
  { walletID: "7733hTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR77" },
  { walletID: "8833hTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR88" },
  { walletID: "9933hTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR99" },
  { walletID: "1033hTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR10" },
];

const initialWinners: Ticket[] = [
  { walletID: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH", amount: 5 },
  { walletID: "24PNhTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR5p", amount: 10 },
  { walletID: "7733hTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR77", amount: 20 },
  { walletID: "3333hTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR5p", amount: 30 },
  { walletID: "1033hTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR10", amount: 50 },
  { walletID: "9933hTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR99", amount: 100 },
];

const DrawingDetail: NextPage = () => {
  const router = useRouter();
  const {
    id: queryId,
    endTime,
    numberOfTicketsSold,
    numberOfTickets,
    ticketPrice,
  } = router.query;
  const lotteryId = queryId as string;
  const parsedEndTime = new Date(endTime as string);
  const parsedNumberOfTicketsSold = Number(numberOfTicketsSold as string);
  const parsedNumberOfTickets = Number(numberOfTickets as string);
  const parsedTicketPrice = Number(ticketPrice as string);
  const parsedLotteryName = name as string;
  const prizePool = parsedTicketPrice * parsedNumberOfTicketsSold;

  const [ticketsWon, setTicketsWon] = useState<Ticket[]>([]);
  const [winningTicket, setWinningTicket] = useState<string>(
    "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH"
  );
  const [availableWinners, setAvailableWinners] =
    useState<Ticket[]>(initialWinners);
  const [availableTickets, setAvailableTickets] =
    useState<Ticket[]>(initialTickets);
  const [winningAmount, setWinningAmount] = useState<number>(10);
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
    const winner = availableWinners[winnerIndex]!;

    setWinningTicket(winner.walletID);
    setWinningAmount(winner.amount!);

    await delay(2200);
    ticketsWon.push(winner);

    removeWinner(winner.walletID);
  }

  function removeWinner(wallet: string) {
    const newWinners = availableWinners.filter(
      (ticket) => ticket.walletID !== wallet
    );
    const newAvailableTickets = availableTickets.filter(
      (ticket) => ticket.walletID !== wallet
    );
    setAvailableWinners(newWinners);
    setAvailableTickets(newAvailableTickets);
  }

  const formatTicketOwningWallet = (wallet: string | undefined) => {
    if (wallet === undefined) {
      return "";
    }
    const firstFour = wallet.substring(0, 4);
    const lastFour = wallet.substring(wallet.length - 4);
    return `${firstFour}...${lastFour}`;
  };

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Format the time as "00 h 03 min 30 sec" string
  const formatTime = (time: Date | null): string => {
    if (!time) return "";

    const now = new Date();
    const remainingTime = Math.max(0, time.getTime() - now.getTime());
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, "0")} h ${String(minutes).padStart(
      2,
      "0"
    )} min ${String(seconds).padStart(2, "0")} sec`;
  };

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
          heading={parsedLotteryName}
          subHeaderDraw="Epic Draw Event: Witness the Excitement Unfold Live!"
          id={lotteryId}
          prizePool={formatPricePool(prizePool)}
          maxTickets={parsedNumberOfTickets}
          soldTickets={parsedNumberOfTicketsSold}
        />

        <div className={styles.containerD}>
          <div className={styles.drawingColumn}>
            <SlotCounter
              value={formatTicketOwningWallet(winningTicket)}
              dummyCharacters={"Solpix".split("")}
              ref={slotWalletRef}
              autoAnimationStart={false}
            />
          </div>
          <div className={styles.drawingColumn2}>
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
                    WINNERS TABLE <span>AMOUNT SOL</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ticketsWon.map((owner, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {formatTicketOwningWallet(owner.walletID)}{" "}
                      <p>{owner.amount} SOL</p>
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
            disabled={isDrawing || isDrawingAll || availableWinners.length == 0}
          >
            Draw one
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
