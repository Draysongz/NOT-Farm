import React, { useState } from 'react';
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
  useColorMode
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
            {!isCollapsed && <Text ml={3}>Dashboard</Text>}
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
            <Icon as={PiTreeStructureBold} boxSize={6} />
            {!isCollapsed && <Text ml={3}>Stake</Text>}
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
              label={`${index == 1 ? "Coming soon" : ""}`}
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
    </Flex>
  );
};

export default Sidebar;
