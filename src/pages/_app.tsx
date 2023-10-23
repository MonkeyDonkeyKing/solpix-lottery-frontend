import { type AppType } from "next/app";

import { api } from "@/utils/api";
import "@/styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { ContextProvider } from "@/contexts/walletProvider/ContextProvider";

const MyApp: AppType<object> = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ContextProvider>
      <Component {...pageProps} />
      <div id="portal" />
    </ContextProvider>
  );
};

export default api.withTRPC(MyApp);
