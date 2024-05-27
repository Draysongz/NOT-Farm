import React, { useState, useEffect } from 'react';
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
import Dashboard from './Dashboard';  // Adjust the import path as needed
import { MdGroups, MdSpaceDashboard, MdCollections } from "react-icons/md";
import { GiMiner } from "react-icons/gi";
import { HiDotsHorizontal } from "react-icons/hi";
import { PiHandWithdraw } from "react-icons/pi";
import { FaCartArrowDown } from "react-icons/fa";
import Link from 'next/link';

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
  const sidebarWidth = useBreakpointValue({ base: '100%', md: isCollapsed ? '5vw' : '20vw' });
  const displaySidebar = useBreakpointValue({ base: 'none', md: 'none', lg: 'block' });

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
      
      <Flex 
        direction={'column'}
        color={'white'}
        bg={'gray.800'}
        boxShadow={'lg'}
        borderRight={'2px solid white'}
        minH={'100vh'}
        w={sidebarWidth}
        display={displaySidebar}
        transition={'width 0.3s'}
        position={{ base: 'relative', md: 'relative' }}
        zIndex={10}
      >
        <Flex p={5} alignItems={'center'} justifyContent={isCollapsed ? 'center' : 'space-around'}>
          {!isCollapsed && <Image src='/logo.png' w={10} />}
          {!isCollapsed && <Heading fontSize={'medium'}>NotMiner</Heading>}
          <Icon as={MdOutlineMenuOpen} boxSize={6} onClick={toggleCollapse} cursor={'pointer'} />
        </Flex>
        <Divider />
        <Flex direction={'column'} alignItems={isCollapsed ? 'center' : 'flex-start'} p={5}>
          <Flex
            alignItems={'center'}
            mb={4}
            onClick={() => handleItemClick('dashboard')}
            bg={selectedItem === 'dashboard' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
            color={selectedItem === 'dashboard' ? 'yellow.300' : 'white'}
            _hover={{
              bg: 'rgba(255, 255, 255, 0.1)',
              color: "yellow.300"
            }}
            cursor={'pointer'}
            p={2}
            borderRadius={'md'}
            w={'100%'}
          >
            <Icon as={MdDashboard} boxSize={6} />
            <Link href={'/'}>
            {!isCollapsed && <Text ml={3}>Dashboard</Text>}
            </Link>
          </Flex>
          <Divider />
          <Flex
            alignItems={'center'}
            onClick={() => handleItemClick('stake')}
            bg={selectedItem === 'stake' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
            color={selectedItem === 'stake' ? 'yellow.300' : 'white'}
            _hover={{
              bg: 'rgba(255, 255, 255, 0.1)',
              color: "yellow.300"
            }}
            cursor={'pointer'}
            p={2}
            borderRadius={'md'}
            w={'100%'}
          >
            <Icon as={MdGroups} boxSize={6} />
            <Link href={'/referrals'}>
            {!isCollapsed && <Text ml={3}>Referrals</Text>}
            </Link>
          </Flex>
        </Flex>
      </Flex>

       <Flex
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          bg={useColorModeValue("white", "#130736")}
          color={useColorModeValue("#10062D", "#fff")}
          p={3}
          justifyContent="space-around"
          zIndex={1}
          display={useBreakpointValue({base: 'flex', md: 'flex', lg: 'none'})}
        >
          {navData.map((item, index) => (
            <Tooltip
              
              hasArrow={index == 1 ? true : false}
              placement="top"
            >
              <Flex
                key={item.title}
                flexDir="column"
                align="center"
                as={NextLink}
                href={item.link}
              >
                <Icon as={item.icon} boxSize={5} mb={2} />
                <Text fontSize={{ base: "xs", md: "md" }}>{item.title}</Text>
              </Flex>
              
            </Tooltip>
          ))}

          
          
        </Flex>
      
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
              This program offers high daily returns and low fees for staking your NOT tokens. 
              You can earn up to 6% daily interest and a referral bonus of up to 5% (more details available).
            </Text>

            <Text fontWeight="bold" mb={2}>How it Works:</Text>
            <Text>1. <strong>Stake NOT:</strong> Deposit your NOT tokens to start earning rewards.</Text>
            <Text>2. <strong>Compound:</strong> To maximize your earnings, reinvest your rewards back into NOT automatically by clicking the "COMPOUND" button.</Text>
            <Text>3. <strong>Claim Rewards:</strong> Transfer your accumulated rewards directly to your wallet.</Text>

            <Text fontWeight="bold" mt={4} mb={2}>Maximizing Your Earnings:</Text>
            <Text>
              The key to earning more rewards is the amount of NOT you stake and how often you compound your rewards. 
              The more NOT you hold and the more frequently you reinvest your earnings, the greater your potential returns.
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
