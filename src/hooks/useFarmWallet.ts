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
import {
  Address,
  Cell,
  OpenedContract,
  Sender,
  beginCell,
  toNano,
} from "@ton/core";
import { JettonWallet } from "@/contracts/JettonWallet";
import { NotcoinFarmWallet } from "@/contracts/NotcoinFarmWallet";

export const useFarmWallet = () => {
  const client = useTonClient();
  const { sender, userAddress } = useTonConnect();
  const [userStakedBalance, setUserStakedBalance] = useState(0);
  const [userWalletBalance, setUserWalletBalance] = useState(0);
  const [currRewards, setCurrRewards] = useState(0);
  const [referredUsers, setNumberOfReferredUsers] = useState(0);
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
      console.log(err.message);
    }
  }, [userAddress, client]);

  // get user farm wallet jetton address
  const fmJettonWalletAddr = useAsyncInitialze(async () => {
    if (!fmWalletAddr) return;
    try {
      return await getUserJettonAddr(client, fmWalletAddr);
    } catch (err) {
      console.log(err.message);
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
      console.log(err.message);
    }
  }, [userAddress, client]);

  // get factory jetton wallet address
  const factoryJettonWalletAddr = useAsyncInitialze(async () => {
    try {
      return await getUserJettonAddr(client, notcoinFarmFactoryAddress);
    } catch (err) {
      console.log(err.message);
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
      console.log("farmwallet", fmWalletAddr.toString());
      try {
        const rewards = await farmWallet.getRewards();
        setCurrRewards(rewards);
        const walletBalance = await jettonWallet.getJettonBalance();
        setUserWalletBalance(Number(walletBalance));
      } catch (err) {
        console.log(err.message);
      }
      await sleep(5000);
      userData();
    };
    userData();
    return () => {};
  }, [client, farmWallet, jettonWallet]);

  useEffect(() => {
    const getUserBalance = async () => {
      if (!client) return;
      if (!farmWallet) return;
      try {
        const { notMiner, numberOfReferredUsers } =
          await farmWallet.getFarmWalletData();
        setUserStakedBalance(notMiner);
        setNumberOfReferredUsers(numberOfReferredUsers);
      } catch (err) {
        console.log(err.message);
      }
      await sleep(8000);
      getUserBalance();
    };
    getUserBalance();

    return () => {};
  }, [client, farmWallet]);

  return {
    userStakedBalance,
    currRewards,
    userWalletBalance,
    referredUsers,

    stake: async (jettonAmount: number) =>
      await sendStake(
        jettonWallet,
        fmWalletAddr,
        Address.parse(userAddress),
        sender,
        jettonAmount
      ),

    depositWithReferral: async (
      jettonAmount: number,
      referrerAddress: string
    ) => {
      console.log("referrer address", referrerAddress);
      return await sendDepositWithReferral(
        jettonWallet,
        Address.parse(userAddress),
        sender,
        jettonAmount,
        Address.parse(referrerAddress)
      );
    },

    compound: async () => await sendCompound(farmWallet, sender),

    claimRewards: async () =>
      await sendClaimRewards(farmWallet, factoryJettonWalletAddr, sender),
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
      toNano("0.1"),
      toNano(jettonAmount),
      notcoinFarmFactoryAddress,
      userAddress,
      new Cell(),
      toNano("0.05"),
      new Cell()
    );
  } catch (err) {
    console.log(err.message);
  }
};

// send transfer message on jetton wallet to user farm wallet
const sendDepositWithReferral = async (
  jettonWallet: OpenedContract<JettonWallet>,
  userAddress: Address,
  via: Sender,
  jettonAmount: number,
  referrerAddress: Address
) => {
  try {
    return await jettonWallet.sendTransfer(
      via,
      toNano("0.1"),
      toNano(jettonAmount),
      notcoinFarmFactoryAddress,
      userAddress,
      new Cell(),
      toNano("0.05"),
      beginCell().storeAddress(referrerAddress).endCell()
    );
  } catch (err) {
    console.log(err.message);
  }
};

// send compound message
const sendCompound = async (
  farmWallet: OpenedContract<NotcoinFarmWallet>,
  via: Sender
) => {
  try {
    return await farmWallet.sendCompound(toNano("0.1"), via);
  } catch (err) {
    console.log(err.message);
  }
};

// send claim rewards message
const sendClaimRewards = async (
  farmWallet: OpenedContract<NotcoinFarmWallet>,
  factoryjettonWalletAddr: Address,
  via: Sender
) => {
  try {
    return await farmWallet.sendClaimRewards(toNano("0.1"), via);
  } catch (err) {
    console.log(err.message);
  }
};
