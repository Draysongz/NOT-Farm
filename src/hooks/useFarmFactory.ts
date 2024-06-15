import { useTonConnect } from "./useTonConnect";
import { useTonClient } from "./useTonClient";
import { useEffect, useState } from "react";
import { useSyncInitialize } from "./useSyncInitialize";
import {
  getUserFarmWalletAddr,
  getUserJettonAddr,
  openFarmFactory,
  openFarmWallet,
} from "@/contracts/FarmConstants";
import { Address, OpenedContract, Sender, toNano } from "@ton/core";
import { NotcoinFarmFactory } from "@/contracts/NotcoinFarmFactory";
import { useAsyncInitialze } from "./useAsyncInitialize";

export const useFarmFactory = () => {
  const client = useTonClient();
  const { sender, userAddress } = useTonConnect();

  // state for TVL, user staked balance, user rewards, user balance in wallet

  const [totalValueLocked, setTotalValueLocked] = useState(0);
  const [farmWalletStatus, setFarmWalletStatus] = useState(0);
  const sleep = async (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));
  // first thing I need to do to be able to stake is
  // initialize the contract.

  // 1. initialize your contract
  // 2. stake tokens (transfer them to initialized contract)

  // open factory contract to initialize the contract
  const farmFactory = useSyncInitialize(() => {
    if (!client) return;
    return openFarmFactory(client);
  }, [client]);

  // get user Farm wallet address
  const fmWalletAddr = useAsyncInitialze(async () => {
    if (!userAddress) return;
    try {
      return await getUserFarmWalletAddr(client, Address.parse(userAddress));
    } catch (err) {
      console.log(err.message);
    }
  }, [client, userAddress]);

  // open farm contract from farm wallet address
  const farmWallet = useSyncInitialize(() => {
    if (!fmWalletAddr) return;
    return openFarmWallet(client, fmWalletAddr);
  }, [client, fmWalletAddr]);

  useEffect(() => {
    const getStatus = async () => {
      if (!client) return;
      if (!farmWallet) return;
      try {
        const { status } = await farmWallet.getFarmWalletData();
        setFarmWalletStatus(status);
      } catch (err) {
        console.log(err.message);
      }
    };
    getStatus();

    return () => {};
  }, [farmWallet, client]);

  useEffect(() => {
    const getTVL = async () => {
      if (!client) return;
      if (!farmFactory) return;
      try {
        const { totalDepositBalance, pool } =
          await farmFactory.getFactoryData();
        setTotalValueLocked(pool);
      } catch (err) {
        console.log(err.message);
      }
      await sleep(9000);
      getTVL();
    };
    getTVL();
    return () => {};
  }, [totalValueLocked, farmFactory, client]);

  return {
    totalValueLocked,
    farmWalletStatus,
  };
};
