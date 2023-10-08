import { api } from "@/utils/api";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { NextPage } from "next";
import { useRouter } from "next/router";

const LotteryDetails: NextPage = () => {
  const router = useRouter();
  const userkey = useWallet().publicKey!;
  if (!userkey) return <p>Not connected</p>;
  const key = new PublicKey(router.query.lottery as string);

  if (!key) return <p>Invalid solana address</p>;
  if (PublicKey.isOnCurve(key)) return <p>Not a PDA</p>;

  const lotteryData = api.lottery.getLotteryData.useQuery({
    lottery: key.toBase58(),
  });
  const tickets = api.lottery.getLotteryTicketsByUser.useQuery({
    lotteryAddress: key.toBase58(),
    userAddress: userkey.toBase58(),
  });
  console.log(tickets.data);
  return <p>Lottery: {JSON.stringify(lotteryData.data, null, 2)}</p>;
};

export default LotteryDetails;
