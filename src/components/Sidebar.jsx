import React, { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Divider,
  Icon,
  Heading,
  Image,
  useBreakpointValue,
  Box,
  useColorModeValue,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button,
  useColorMode,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { MdDashboard, MdOutlineMenuOpen, MdMenu } from "react-icons/md";
import { PiTreeStructureBold } from "react-icons/pi";
import Dashboard from "./Dashboard"; // Adjust the import path as needed
import { MdGroups, MdSpaceDashboard, MdCollections } from "react-icons/md";
import { GiMiner } from "react-icons/gi";
import { HiDotsHorizontal } from "react-icons/hi";
import { PiHandWithdraw } from "react-icons/pi";
import { FaCartArrowDown } from "react-icons/fa";
import Link from "next/link";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const { colorMode, toggleColorMode } = useColorMode();
  const sidebarWidth = useBreakpointValue({
    base: "100%",
    md: isCollapsed ? "5vw" : "20vw",
  });
  const displaySidebar = useBreakpointValue({
    base: "none",
    md: "none",
    lg: "block",
  });

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const navData = [
    { icon: MdSpaceDashboard, title: "Dashboard", link: "/" },
    { icon: MdGroups, title: "Referrals", link: "/referrals" },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const timer = setTimeout(onOpen, 3000);
    return () => clearTimeout(timer);
  }, [onOpen]);

  return (
    <Flex direction={useBreakpointValue({base: 'column-reverse', md: 'column-reverse', lg: 'row'})}>
      
 
      
      <Box  transition={'margin-left 0.3s'}>
        <Dashboard isCollapsed={isCollapsed} />
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Earn Rewards with NOT Staking</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              This program offers high daily returns and low fees for staking
              your NOT tokens. You can earn up to 6% daily interest and a
              referral bonus of up to 5% (more details available).
            </Text>

            <Text fontWeight="bold" mb={2}>
              How it Works:
            </Text>
            <Text>
              1. <strong>Stake NOT:</strong> Deposit your NOT tokens to start
              earning rewards.
            </Text>
            <Text>
              2. <strong>Compound:</strong> To maximize your earnings, reinvest
              your rewards back into NOT automatically by clicking the
              "COMPOUND" button.
            </Text>
            <Text>
              3. <strong>Claim Rewards:</strong> Transfer your accumulated
              rewards directly to your wallet.
            </Text>

            <Text fontWeight="bold" mt={4} mb={2}>
              Maximizing Your Earnings:
            </Text>
            <Text>
              The key to earning more rewards is the amount of NOT you stake and
              how often you compound your rewards. The more NOT you hold and the
              more frequently you reinvest your earnings, the greater your
              potential returns.
            </Text>

            <Button mt={4} colorScheme="teal" onClick={onClose}>
              Get Started
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Sidebar;
