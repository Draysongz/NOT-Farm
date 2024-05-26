import {
  Box,
  Stack,
  Button,
  Container,
  Divider,
  Text,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Icon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ButtonGroup,
  Card,
  CardBody,
  Heading,
  useColorModeValue,
  Input,
  Flex,
  HStack
} from "@chakra-ui/react";
import Image from "next/image";
import logo from "../../public/logo.png";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useEffect } from "react";
import { useTonClient } from "@/hooks/useTonClient";
import { useTonConnect } from "@/hooks/useTonConnect";
import { app, db } from "../../Firebase/firebase";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "./Sidebar";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useFarmFactory } from "@/hooks/useFarmFactory";
import { useFarmWallet } from "@/hooks/useFarmWallet";
import { fromNano } from "@ton/core";
import Dashboard from "./Dashboard";
export default function Bana() {
  const { initializeFarmContract, totalValueLocked, farmWalletStatus } =
    useFarmFactory();
  const {
    userStakedBalance,
    userWalletBalance,
    currRewards,
    stake,
    unstake,
    compound,
    claimRewards,
  } = useFarmWallet();
  const { connected, userAddress: walletAddress } = useTonConnect();
  const client = useTonClient();
  const [referralLink, setReferralLink] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const { code } = router.query;

  const [amount, setAmount] = useState(0);
  const [reward, setReward] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [userDeets, setUserDeets] = useState(null);
  const [unsubscribe, setUnsubscribe] = useState(null);

  useEffect(() => {
    // Function to fetch user data and subscribe to real-time updates
    const fetchUserData = async () => {
      if (!walletAddress) return; // Exit early if walletAddress is not set

      const q = query(
        collection(db, "users"),
        where("walletAddress", "==", walletAddress)
      );

      // Subscribe to real-time updates using onSnapshot
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const user = querySnapshot.docs[0];
          setUserId(user.id);
          setUserDeets(user.data());
        } else {
          setUserId(""); // Clear userId if user not found
          setUserDeets(null); // Clear userDeets if user not found
          console.log("User not found for wallet address:", walletAddress);
        }
      });

      // Return the unsubscribe function to clean up the listener
      return unsubscribe;
    };

    // Call fetchUserData when walletAddress changes
    const unsubscribe = () => {
      fetchUserData();
    };

    // Clean up the listener when component unmounts or walletAddress changes
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Invoke the unsubscribe function to detach listener
      }
    };
  }, [walletAddress]);

  useEffect(() => {
    const registerWithReferral = async () => {
      if (!code || !walletAddress) return;

      // Check if the registration cookie exists
      const registrationDone = Cookies.get("registrationDone");
      if (registrationDone) {
        console.log("Referral registration already done.");
        return;
      }

      try {
        const q = query(
          collection(db, "users"),
          where("referralCode", "==", code)
        );
        const referrerSnapshot = await getDocs(q);

        if (referrerSnapshot.empty) {
          console.error("Invalid referral code");
          return;
        }

        const referrer = referrerSnapshot.docs[0];
        const referrerId = referrer.id;

        // Generate a unique user ID for the new user
        const userId = uuidv4();

        await setDoc(doc(db, "users", userId), {
          walletAddress,
          referralCode: null, // New users do not have referral codes initially
          rewards: 0,
        });

        await addDoc(collection(db, "referrals"), {
          referrerId,
          refereeId: userId,
        });

        setUserId(userId);

        // Set registration cookie to persist for 1 year
        Cookies.set("registrationDone", "true", { expires: 365 });
      } catch (error) {
        console.error("Error registering user with referral:", error.message);
      }
    };

    // Register user with referral on component mount
    registerWithReferral();
  }, [code, walletAddress]);

  useEffect(() => {
    const checkExistingReferralLink = async () => {
      if (!walletAddress) return;

      const q = query(
        collection(db, "users"),
        where("walletAddress", "==", walletAddress)
      );

      try {
        const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const existingReferralCode = userDoc.data().referralCode;
            if (existingReferralCode == null) {
              setReferralLink("");
              setUserId("");
            } else {
              const existingReferralLink = `https://notminer-git-master-brandai.vercel.app/?code=${existingReferralCode}`;
              setReferralLink(existingReferralLink);
              setUserId(userDoc.id);
            }
          }
        });

        // Store unsubscribe function in state
        setUnsubscribe(() => unsubscribeSnapshot);
      } catch (error) {
        console.error("Error setting up Firestore listener:", error.message);
        toast.error("Error setting up referral link listener.");
      }
    };

    // Call function to start listening
    checkExistingReferralLink();

    // Clean-up function to unsubscribe
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Invoke the unsubscribe function
        setUnsubscribe(null); // Clear unsubscribe function after detaching
      }
    };
  }, [walletAddress]); // Added referralLink as a dependency to monitor changes

  const handleStake = async () => {
    const q = query(
      collection(db, "referrals"),
      where("refereeId", "==", userId)
    );
    const referralSnapshot = await getDocs(q);

    if (referralSnapshot.empty) {
      console.error("No referrer found");
      return;
    }

    const referral = referralSnapshot.docs[0];
    const referrerId = referral.data().referrerId;
    const rewardAmount = amount * 0.05;

    const referrerDocRef = doc(db, "users", referrerId);
    await updateDoc(referrerDocRef, {
      rewards: increment(rewardAmount),
    });

    setReward(rewardAmount);
  };

  const getRewards = async () => {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists) {
      console.error("User not found");
      return;
    }

    setRewards(userDoc.data().rewards);
  };

  const generateReferralLink = async () => {
    if (referralLink) {
      toast.warning("Referaal link exists");
      return;
    }

    const userId = uuidv4(); // Generate a unique user ID
    const referralCode = uuidv4(); // Generate a unique referral code
    let processingToast;

    try {
      // Show processing toast
      processingToast = toast.promise(
        new Promise((resolve) => {
          setTimeout(resolve, 3000); // Simulating processing time
        }),
        {
          pending: "Generating referral link...",
          success: "Referral link generated successfully!",
          error: "Failed to generate referral link. Please try again later.",
          autoClose: 3000, // Close notification after 3 seconds
        }
      );

      await setDoc(
        doc(db, "users", userId),
        {
          walletAddress,
          referralCode,
          rewards: 0,
        },
        { merge: true }
      );

      const newReferralLink = `https://notminer-git-master-brandai.vercel.app/?code=${referralCode}`;
      setReferralLink(newReferralLink);
      setUserId(userId);

      // Resolve the processing toast with success message
      toast.update(processingToast, {
        render: "success",
        autoClose: 3000, // Close success notification after 3 seconds
      });
    } catch (error) {
      console.error("Error generating referral link:", error.message);

      // Resolve the processing toast with error message
      toast.update(processingToast, {
        render: "error",
        autoClose: 3000, // Close error notification after 3 seconds
      });
    }
  };

  return (
    <>
      <Flex
      minH={'100vh'} 
      >
<Sidebar />


      </Flex>
    </>
  );
}
