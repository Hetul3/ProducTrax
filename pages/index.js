import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session, status } = useSession();

  const styling = {
    textAlign: 'center',

  }
  return (
    <>
      <h1 style={styling}>TODO the landing page</h1>
    </>
  );
}
