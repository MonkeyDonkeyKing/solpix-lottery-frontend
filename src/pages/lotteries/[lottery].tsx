import { NextPage } from "next";
import { useRouter } from "next/router";

const LotteryDetails: NextPage = () => {
  const router = useRouter();
  return <p>Post: {JSON.stringify(router.query.lottery, null, 2)}</p>;
};

export default LotteryDetails;
