import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Box, Button, Container, Stack } from "@chakra-ui/react";
import wp from "../images/backgroundc2b2d891.svg";
import Bana from "@/components/bana";
 


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Not Miner</title>
        <meta name="description" content="Not Miner" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
       
          <Bana />
        
      </main>
    </>
  );
}
