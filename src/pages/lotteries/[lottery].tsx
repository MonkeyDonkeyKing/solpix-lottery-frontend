import { api } from "@/utils/api";
import { PublicKey } from "@solana/web3.js";
import { NextPage } from "next";
import { useRouter } from "next/router";

const LotteryDetails: NextPage = () => {
  const router = useRouter();
  const key = new PublicKey(router.query.lottery as string);
  if (!key) return <p>Invalid solana address</p>;
  if (PublicKey.isOnCurve(key)) return <p>Not a PDA</p>;

  const lotteryData = api.lottery.getLotteryData.useQuery({
    lottery: key.toBase58(),
  });
  return <p>Lottery: {JSON.stringify(lotteryData.data, null, 2)}</p>;
};

export default LotteryDetails;
