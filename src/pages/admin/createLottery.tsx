import { api } from "@/utils/api";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import { NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";

const CreateLottery: NextPage = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [endTime, setEndTime] = useState<number>(
    Math.floor(new Date().getTime() / 1000) + 7200
  );
  const [distribution, setDistribution] = useState<number>(0);
  const [numberOfTickets, setNumberOfTickets] = useState<number>(100);
  const [ticketPrice, setTicketPrice] = useState<number>(0.1);
  const [possibleWinners, setPossibleWinners] = useState<number>(10);
  const transactionProcessor =
    api.lotteryV2.client.processSignedTx.useMutation();

  const createLotteryIx = api.lotteryV2.admin.getCreateLotteryIxOrTx.useQuery(
    {
      lotteryArgs: {
        endTime,
        distribution,
        numberOfTickets,
        ticketPrice: ticketPrice ** 9,
        possibleWinners,
      },
      user: wallet.publicKey?.toBase58() || "",
      type: "tx",
    },
    {
      enabled: false,
    }
  );

  const send = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) return;
    const refetchResult = await createLotteryIx.refetch();
    console.log(refetchResult.isLoading);
    console.log(refetchResult.data);
    if (!refetchResult.data) return console.log(refetchResult.error);
    const transactionMessage = VersionedTransaction.deserialize(
      refetchResult.data as unknown as Uint8Array
    );
    console.log(transactionMessage);
    const tx = await wallet.signTransaction(transactionMessage);
    const serialized = tx.serialize();
    const txid = await transactionProcessor.mutateAsync({
      signedTx: Array.from(serialized),
    });
  };

  return (
    <>
      <Head>
        <title>Assign master section</title>
        <meta name="description" content="Solpix Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section>
          <h1>Assign Lottery master</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              color: "white",
            }}
          >
            <label>
              end time:
              <input
                type="number"
                value={endTime}
                onChange={(e) => setEndTime(parseInt(e.target.value))}
                min={0}
              />
            </label>
            <label>
              distribution:
              <input
                type="number"
                value={distribution}
                onChange={(e) => setDistribution(parseInt(e.target.value))}
                min={0}
              />
            </label>
            <label>
              number of tickets:
              <input
                type="number"
                value={numberOfTickets}
                onChange={(e) => setNumberOfTickets(parseInt(e.target.value))}
                min={0}
              />
            </label>
            <label>
              ticket price:
              <input
                type="number"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(+e.target.value)}
                step={"0.1"}
              />
            </label>
            <label>
              possible winners:
              <input
                type="number"
                value={possibleWinners}
                onChange={(e) => setPossibleWinners(+e.target.value)}
                min={0}
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        </section>
      </Layout>
    </>
  );
};

export default CreateLottery;
