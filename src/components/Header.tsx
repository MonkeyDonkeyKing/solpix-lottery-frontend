// Header.tsx
import {
  useWalletModal,
} from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faHandshake,
  faWallet,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";
import { useWallet } from "@solana/wallet-adapter-react";
import { api } from "@/utils/api";

const Header = () => {
  const { publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const { data: isAdmin } = api.lottery.isAdmin.useQuery(
    {
      admin: publicKey?.toBase58()!,
    },
    {
      enabled: !!publicKey,
    }
  );

  return (
    <div className={styles.navigation}>
      <nav>
        <Link href={"/"}>
          <svg viewBox="0 0 244.43135999999998 31.10944581818182" height="25" width="230"><g transform="matrix(1,0,0,1,0,0)"><svg width="244.43135999999998" viewBox="0 -50 343.739990234375 43.75" height="31.10944581818182" data-palette-color="#030303"><path d="M12.5-6.25L0-6.25 0-50 12.5-50 12.5-43.75 18.75-43.75 18.75-37.5 25-37.5 25-31.25 31.25-31.25 31.25-50 43.75-50 43.75-6.25 31.25-6.25 31.25-18.75 25-18.75 25-25 18.75-25 18.75-31.25 12.5-31.25 12.5-6.25ZM87.5-6.25L56.25-6.25 56.25-12.5 50-12.5 50-31.25 56.25-31.25 56.25-37.5 87.5-37.5 87.5-31.25 93.75-31.25 93.75-18.75 62.5-18.75 62.5-12.5 87.5-12.5 87.5-6.25ZM62.5-31.25L62.5-25 81.25-25 81.25-31.25 62.5-31.25ZM112.5-6.25L100-6.25 100-12.5 106.25-12.5 106.25-18.75 112.5-18.75 112.5-25 106.25-25 106.25-31.25 100-31.25 100-37.5 112.5-37.5 112.5-31.25 118.75-31.25 118.75-25 125-25 125-31.25 131.25-31.25 131.25-37.5 143.75-37.5 143.75-31.25 137.5-31.25 137.5-25 131.25-25 131.25-18.75 137.5-18.75 137.5-12.5 143.75-12.5 143.75-6.25 131.25-6.25 131.25-12.5 125-12.5 125-18.75 118.75-18.75 118.75-12.5 112.5-12.5 112.5-6.25ZM181.24-6.25L149.99-6.25 149.99-50 181.24-50 181.24-43.75 187.49-43.75 187.49-37.5 193.74-37.5 193.74-18.75 187.49-18.75 187.49-12.5 181.24-12.5 181.24-6.25ZM162.49-43.75L162.49-12.5 174.99-12.5 174.99-18.75 181.24-18.75 181.24-37.5 174.99-37.5 174.99-43.75 162.49-43.75ZM218.74-37.5L218.74-31.25 224.99-31.25 224.99-25 218.74-25 218.74-6.25 206.24-6.25 206.24-37.5 218.74-37.5ZM224.99-37.5L243.74-37.5 243.74-31.25 224.99-31.25 224.99-37.5ZM293.74-6.25L256.24-6.25 256.24-12.5 249.99-12.5 249.99-18.75 256.24-18.75 256.24-25 281.24-25 281.24-31.25 256.24-31.25 256.24-37.5 287.49-37.5 287.49-31.25 293.74-31.25 293.74-6.25ZM262.49-18.75L262.49-12.5 281.24-12.5 281.24-18.75 262.49-18.75ZM312.49-37.5L312.49-12.5 318.74-12.5 318.74-6.25 306.24-6.25 306.24-12.5 299.99-12.5 299.99-37.5 312.49-37.5ZM318.74-37.5L324.99-37.5 324.99-12.5 318.74-12.5 318.74-37.5ZM331.24-37.5L343.74-37.5 343.74-12.5 337.49-12.5 337.49-6.25 324.99-6.25 324.99-12.5 331.24-12.5 331.24-37.5Z" opacity="1" transform="matrix(1,0,0,1,0,0)" fill="#ffffff" data-fill-palette-color="primary" id="text-0"></path></svg></g></svg>
        </Link>
        <li>
          <FontAwesomeIcon icon={faPencil} />
          <Link href={"/drawing"}>Drawing</Link>
        </li>
        <li>
          <FontAwesomeIcon icon={faHandshake} />
          <Link href={"/collaborate"}>Collaborate</Link>
        </li>
        {isAdmin && (
          <li>
            <FontAwesomeIcon icon={faScrewdriverWrench} />
            <Link href={"/adminOverview"}>Admin</Link>
          </li>
        )}
        <li>
          <FontAwesomeIcon icon={faWallet} />
          <button
            className={styles.walletButton}
            onClick={!publicKey ? () => setVisible(true) : () => disconnect()}
          >
            {publicKey ? "Disconnect" : "Connect"}
          </button>
        </li>
      </nav>
    </div>
  );
};

export default Header;
