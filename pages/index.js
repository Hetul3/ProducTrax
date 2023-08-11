import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session, status } = useSession();

  const headerStyling = {
    textAlign: 'center',
    fontFamily: 'Noto Sans, sans-serif',
    marginBottom: "20px",
    marginTop: "200px",
    fontSize: "150px",
    transform: "translateY(-50px)",
    opacity: 0,
    transition: "transform 0.5s ease, opacity 0.5s ease",
  };

  const paragraphStyling = {
    fontSize: "40px",
    textAlign: 'center',
    fontFamily: 'Helvetica, sans-serif',
    opacity: 0,
    transition: "opacity 0.5s ease 1s", // Delay of 1 second
  };

  useEffect(() => {
    const header = document.getElementById("header");
    const paragraph = document.getElementById("paragraph");

    setTimeout(() => {
      header.style.transform = "translateY(0)";
      header.style.opacity = 1;

      paragraph.style.opacity = 1;
    }, 1000); // 1 second delay
  }, []);

  return (
    <>
      <h1 id="header" style={headerStyling}>
        TODO
      </h1>
      <p id="paragraph" style={paragraphStyling}>
        A Minimalist Approach to Productivity
      </p>
    </>
  );
}