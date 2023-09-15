import { type AppType } from "next/app";

import { api } from "@/utils/api";
import { WalletAdapterProvider } from "@/contexts/WalletAdapterProvider";

import "@/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WalletAdapterProvider>
      <Component {...pageProps} />
      <div id="portal" />
    </WalletAdapterProvider>
  );
};

export default api.withTRPC(MyApp);
