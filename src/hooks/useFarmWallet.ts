import { useEffect, useState } from "react";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { useSyncInitialize } from "./useSyncInitialize";
import {
  getUserFarmWalletAddr,
  getUserJettonAddr,
  openFarmWallet,
  openJettonWallet,
  notcoinFarmFactoryAddress,
} from "@/contracts/FarmConstants";
import { useAsyncInitialze } from "./useAsyncInitialize";
import { Address, Cell, OpenedContract, Sender, toNano } from "@ton/core";
import { JettonWallet } from "@/contracts/JettonWallet";
import { NotcoinFarmWallet } from "@/contracts/NotcoinFarmWallet";

export const useFarmWallet = () => {
  const client = useTonClient();
  const { sender, userAddress } = useTonConnect();
  const [userStakedBalance, setUserStakedBalance] = useState(0);
  const [userWalletBalance, setUserWalletBalance] = useState(0);
  const [currRewards, setCurrRewards] = useState(0);
  const sleep = async (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));
  // stake, compound, claim rewards, unstake, get staked balance, get rewards

  // I need the farm wallet address gotten from the user address

  // get user Farm wallet address
  const fmWalletAddr = useAsyncInitialze(async () => {
    if (!userAddress) return;
    try {
      return await getUserFarmWalletAddr(client, Address.parse(userAddress));
    } catch (err) {
      console.log(err);
    }
  }, [userAddress, client]);

  // get user farm wallet jetton address
  const fmJettonWalletAddr = useAsyncInitialze(async () => {
    if (!fmWalletAddr) return;
    try {
      return await getUserJettonAddr(client, fmWalletAddr);
    } catch (err) {
      console.log(err);
    }
  }, [fmWalletAddr, client]);

  // open farm contract from farm wallet address
  const farmWallet = useSyncInitialize(() => {
    if (!fmWalletAddr) return;
    return openFarmWallet(client, fmWalletAddr);
  }, [fmWalletAddr, client]);

  // get user jetton wallet address
  const userJettonWalletAddr = useAsyncInitialze(async () => {
    if (!userAddress) return;
    try {
      return await getUserJettonAddr(client, Address.parse(userAddress));
    } catch (err) {
      console.log(err);
    }
  }, [userAddress, client]);

  // get factory jetton wallet address
  const factoryJettonWalletAddr = useAsyncInitialze(async () => {
    try {
      return await getUserJettonAddr(client, notcoinFarmFactoryAddress);
    } catch (err) {
      console.log(err);
    }
  }, [client, userAddress]);

  // open jetton wallet from user jetton wallet address
  const jettonWallet = useSyncInitialize(() => {
    if (!userJettonWalletAddr) return;
    return openJettonWallet(client, userJettonWalletAddr);
  }, [client, userJettonWalletAddr]);

  useEffect(() => {
    const userData = async () => {
      if (!client) return;
      if (!farmWallet) return;
      if (!jettonWallet) return;
      try {
        const { depositBalance } = await farmWallet.getFarmWalletData();
        setUserStakedBalance(depositBalance);
        const rewards = await farmWallet.getRewards();
        setCurrRewards(rewards);
        const walletBalance = await jettonWallet.getJettonBalance();
        setUserWalletBalance(Number(walletBalance));
      } catch (err) {
        console.log(err);
      }
      await sleep(5000);
      userData();
    };
    userData();
    return () => {};
  }, [client, farmWallet, jettonWallet]);

  return {
    userStakedBalance,
    currRewards,
    userWalletBalance,

    stake: async (jettonAmount: number) =>
      await sendStake(
        jettonWallet,
        fmWalletAddr,
        Address.parse(userAddress),
        sender,
        jettonAmount
      ),

    compound: async () => await sendCompound(farmWallet, sender),

    claimRewards: async () =>
      await sendClaimRewards(farmWallet, factoryJettonWalletAddr, sender),

    unstake: async (jettonAmount: number) =>
      await sendUnstake(farmWallet, fmJettonWalletAddr, sender, jettonAmount),
  };
};

// send transfer message on jetton wallet to user farm wallet
const sendStake = async (
  jettonWallet: OpenedContract<JettonWallet>,
  farmWalletAddr: Address,
  userAddress: Address,
  via: Sender,
  jettonAmount: number
) => {
  try {
    return await jettonWallet.sendTransfer(
      via,
      toNano("0.05"),
      toNano(jettonAmount),
      notcoinFarmFactoryAddress,
      userAddress,
      new Cell(),
      toNano("0.005"),
      new Cell()
    );
  } catch (err) {
    console.log(err);
  }
};

// send compound message
const sendCompound = async (
  farmWallet: OpenedContract<NotcoinFarmWallet>,
  via: Sender
) => {
  try {
    return await farmWallet.sendCompound(toNano("0.05"), via);
  } catch (err) {
    console.log(err);
  }
};

// send claim rewards message
const sendClaimRewards = async (
  farmWallet: OpenedContract<NotcoinFarmWallet>,
  factoryjettonWalletAddr: Address,
  via: Sender
) => {
  try {
    return await farmWallet.sendClaimRewards(
      toNano("0.05"),
      via,
      factoryjettonWalletAddr
    );
  } catch (err) {
    console.log(err);
  }
};

// send unstaked message
const sendUnstake = async (
  farmWallet: OpenedContract<NotcoinFarmWallet>,
  userFarmWalletJettonWallet: Address,
  via: Sender,
  jettonAmount: number
) => {
  try {
    return await farmWallet.sendUnstake(
      toNano("0.05"),
      via,
      userFarmWalletJettonWallet,
      toNano(jettonAmount)
    );
  } catch (err) {
    console.log(err);
  }
};
