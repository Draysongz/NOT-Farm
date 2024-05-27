import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  Button,
  useColorModeValue,
  Icon,
  SimpleGrid,
  Grid,
  GridItem,
  Divider,
  Image,
  useBreakpointValue,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode
} from "@chakra-ui/react";
import { FaChartPie, FaDollarSign, FaBitcoin } from "react-icons/fa";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { MdDashboard, MdOutlineMenuOpen, MdMenu } from "react-icons/md";
import { PiTreeStructureBold } from "react-icons/pi";
import { MdGroups, MdSpaceDashboard, MdCollections } from "react-icons/md";
import { GiMiner } from "react-icons/gi";
import { HiDotsHorizontal } from "react-icons/hi";
import { PiHandWithdraw } from "react-icons/pi";
import { FaCartArrowDown } from "react-icons/fa";

export default function Referrals() {
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

  const cardData = [
    {
      title: "Total Royalties",
      text: "0 XXXXXX",
    },
    {
      title: "Referrals",
      text: "0",
    }
    // Add more card data objects as needed
  ];

   const navData = [
    { icon: MdSpaceDashboard, title: "Dashboard", link: "/" },
    { icon: MdGroups, title: "Referrals", link: "/referrals" },
  ];

  return (

     <Flex direction={useBreakpointValue({base: 'column-reverse', md: 'column-reverse', lg: 'row'})} bg={"black"}>
      
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

    <Stack p={5} spacing={10} w={"100%"} minH={'100vh'}>
      {/* 1st Section */}
      <Grid
        justifyContent={"space-between"}
        templateColumns={[
          "repeat(1, 100%)",
          "repeat(2,  48%)",
          "repeat(2, 48%)",
          "repeat(3, 31%)",
        ]}
        gap={3}
      >
        {cardData.map((card, index) => (
          <Flex
            rounded={"2xl"}
            key={card.src}
            border="2px solid"
            borderColor={ "#3e382a"}
            align={"center"}
            justify={"space-around"}
            bg={
              index == 0 ? "#282828" : useColorModeValue("#ffffff", "#10062D")
            }
            px={4}
            py={4}
            gap={3}
          >
            {index == 0 ? (
              <Box bg={"#ED8936"} p={1.5} rounded="full">
                <Icon boxSize={7} color={"#fff"} as={FaBitcoin} />
              </Box>
            ) : (
              <Box
                bg="#ED8936"
                rounded="full"
                p={1.5}
              >
                <Icon
                  boxSize={7}
                  color="white"
                  as={FaChartPie}
                />
              </Box>
            )}

            <Stack
              color={index == 0 ? "#fff" : useColorModeValue("#10062D", "#fff")}
            >
              <Text fontSize={"xs"} fontWeight="600">
                {card.title}
              </Text>
              <Text fontSize={"sm"} fontWeight="800" mt={"-10px"}>
                {card.text}
              </Text>
            </Stack>
          </Flex>
        ))}
      </Grid>

      {/* 2nd Section */}
      <Box
        border="2px solid"
        borderColor={useColorModeValue("#EDE8FC", "#301287")}
        color={useColorModeValue("#10062D", "#fff")}
        rounded={"2xl"}
        align={"center"}
        justify={"space-between"}
        px={[5, 20]}
        py={[10, 20]}
      >
        <Heading fontSize={"md"} color={'white'}>Refer Friends & Get Rewarded!</Heading>
        <Text whiteSpace={"pre-wrap"} mt={2} color={'white'} fontSize={["13px", "sm"]}>
          Get rewarded for sharing xxxxx with your friends. Invite them by using
          your unique code link below.
        </Text>
      </Box>

      {/* 3rd Section */}
      <Box
        mb={10}
        px={[5, 5, 6]}
        py={3}
        bg={useColorModeValue("#F9F8FE", "#301287")}
        borderRadius={"lg"}
        display={"flex"}
        alignContent={"center"}
      >
        <Flex w={"100%"} align={"center"} justify={"space-between"}>
          <Box
            borderLeftRadius={"lg"}
            border={["0", "1px solid"]}
            borderColor={[
              useColorModeValue("#EDE8FC", "#501EE1"),
              useColorModeValue("#EDE8FC", "#501EE1"),
            ]}
            w={"100%"}
            display={"flex"}
            justifyContent={["left", "left", "left", "center"]}
            alignItems={"center"}
            h={10}
            pl={[0, 5]}
            py={[8, 6, 6, 6]}
          >
            <Text
              fontSize={["xs", "sm", "sm", "md"]}
              w={["145px", "230px", "230px", "auto"]}
            >
             
            </Text>
          </Box>

          <Button
            bg={useColorModeValue("#8F6AFB", "#501EE1")}
            borderRightRadius={"10px"}
            borderLeftRadius={["10px", "0"]}
            color={"#FFFFFF"}
            h={[10, "50px", "50px", "50px"]}
            w={"100px"}
          >
            Copy
          </Button>
        </Flex>
      </Box>
   
    </Stack>

    </Flex>
  );
}

