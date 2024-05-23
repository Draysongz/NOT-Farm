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
      console.log(err);
    }
  }, [client, userAddress]);

  // to initialize contract, I need the jetton address of the user Farm contract
  const jettonAddr = useAsyncInitialze(async () => {
    if (!fmWalletAddr) return;
    try {
      return await getUserJettonAddr(client, fmWalletAddr);
    } catch (err) {
      console.log(err);
    }
  }, [client, fmWalletAddr]);

  // open farm contract from farm wallet address
  const farmWallet = useSyncInitialize(() => {
    if (!fmWalletAddr) return;
    return openFarmWallet(client, fmWalletAddr);
  }, [client, fmWalletAddr]);

  useEffect(() => {
    (async () => {
      if (!client) return;
      if (!farmWallet) return;
      try {
        const { status } = await farmWallet.getFarmWalletData();
        setFarmWalletStatus(status);
        await sleep(5000); // 5 secs
      } catch (err) {
        console.log(err);
      }
    })();
  }, [farmWallet, client, farmWalletStatus]);

  useEffect(() => {
    (async () => {
      if (!client) return;
      if (!farmFactory) return;
      try {
        const tvl = await farmFactory.getTotalStakedBalance();
        setTotalValueLocked(tvl);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [totalValueLocked, farmFactory, client]);

  return {
    totalValueLocked,
    farmWalletStatus,

    initializeFarmContract: async () => {
      console.log(jettonAddr.toString());
      return await initializeUserFarmContract(farmFactory, sender, jettonAddr);
    },
  };
};

const initializeUserFarmContract = async (
  farmContract: OpenedContract<NotcoinFarmFactory>,
  via: Sender,
  farmWalletJettonAddr: Address
) => {
  try {
    return await farmContract.sendInitializeFarmWallet(
      via,
      toNano("0.05"),
      farmWalletJettonAddr
    );
  } catch (err) {
    console.log(err);
  }
};
