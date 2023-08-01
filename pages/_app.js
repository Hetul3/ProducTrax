import "@/styles/globals.scss";
import Navbar from "../components/navbar.js";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <>
      <SessionProvider>
        <Navbar />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}
