import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Flex,
  Text,
  Icon,
  Box,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useBreakpointValue,
} from "@chakra-ui/react";
import { TonConnectButton } from "@tonconnect/ui-react";
import { CiDollar } from "react-icons/ci";
import { PiCopy } from "react-icons/pi";
import { useFarmFactory } from "@/hooks/useFarmFactory";
import { useFarmWallet } from "@/hooks/useFarmWallet";
import { fromNano } from "@ton/core";
import axios from "axios";
import { useRouter } from "next/router";
const Dashboard = ({ isCollapsed }) => {
  const router = useRouter();
  const { referralId } = router.query;
  const { totalValueLocked, farmWalletStatus } = useFarmFactory();
  const {
    userStakedBalance,
    userWalletBalance,
    currRewards,
    stake,
    depositWithReferral,
    compound,
    claimRewards,
  } = useFarmWallet();

  const [depositAmount, setDepositAmount] = useState(0);
  const [priceInUsd, setPriceInUsd] = useState(0);

  const tvl =
    Number(fromNano(totalValueLocked)) +
    Number(fromNano(totalValueLocked)) * 0.25;

  const fetchNotPrice = async () => {
    try {
      const response = await axios.get(
        "https://api.dexscreener.com/latest/dex/tokens/EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT"
      );
      const notcoinData = response.data;
      console.log(notcoinData);

      // Assuming the price is available in the data structure
      if (notcoinData && notcoinData.pairs && notcoinData.pairs.length > 0) {
        const priceInUsd = notcoinData.pairs[0].priceUsd;
        setPriceInUsd(priceInUsd);
      }
    } catch (error) {
      console.error("Error fetching NotCoin price:", error.message);
    }
  };

  useEffect(() => {}, [priceInUsd]);

  useEffect(() => {
    fetchNotPrice();
  }, []);
  useEffect(() => {
    const base_url = location.origin;
    console.log(base_url, referralId);
  }, [referralId]);
  return (
    <Flex
      direction={"column"}
      minH={"100vh"}
      minW={useBreakpointValue({
        base: "80vw",
        md: "80vw",
        lg: isCollapsed ? "95vw" : "80vw",
      })}
      w={useBreakpointValue({
        base: "100vw",
        md: "100vw",
        lg: isCollapsed ? "95vw" : "65vw",
      })}
      bg={"black"}
      color={"white"}
      p={5}
      transition={"min-width 0.3s"}
    >
      <Flex justifyContent={"space-between"} p={3}>
        <Text fontSize={"x-large"}>NotMiner</Text>
        <TonConnectButton />
      </Flex>
      <Divider />

      <Flex
        mt={5}
        justifyContent={"space-between"}
        direction={["column", "column", "column", "row"]}
      >
        <Card
          w={useBreakpointValue({ base: "100%", md: "100%", lg: "18vw" })}
          h={"15vh"}
          bg={"#282828"}
          border={"2px solid #3e382a"}
          mb={useBreakpointValue({ base: "4%", md: "0%", lg: "0%" })}
        >
          <CardBody>
            <Flex h="100%" alignItems={"center"} gap={5}>
              <Flex
                alignItems={"center"}
                justifyContent={"center"}
                bg={"#3e382a"}
                borderRadius={"8px"}
                border={"1px solid #826b31"}
                w={useBreakpointValue({ base: "13vw", md: "10vw", lg: "4vw" })}
                h={"7vh"}
              >
                <Icon as={CiDollar} boxSize={8} color={"white"} />
              </Flex>

              <Flex direction={"column"}>
                <Text color={"#cea638"} fontSize={"small"}>
                  Your NotMiner
                </Text>
                <Text fontWeight={"700"} color={"white"}>
                  {Number(fromNano(userStakedBalance)).toFixed(2)} NOTM
                </Text>
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <Card
          w={useBreakpointValue({ base: "100%", md: "100%", lg: "18vw" })}
          h={"15vh"}
          bg={"#282828"}
          border={"2px solid #3e382a"}
          mb={useBreakpointValue({ base: "4%", md: "0%", lg: "0%" })}
        >
          <CardBody>
            <Flex h="100%" alignItems={"center"} gap={5}>
              <Flex
                alignItems={"center"}
                justifyContent={"center"}
                bg={"#3e382a"}
                borderRadius={"8px"}
                border={"1px solid #826b31"}
                w={useBreakpointValue({ base: "13vw", md: "10vw", lg: "4vw" })}
              >
                <Icon as={CiDollar} boxSize={8} color={"white"} />
              </Flex>

              <Flex direction={"column"}>
                <Text color={"#cea638"} fontSize={"small"}>
                  Rewards
                </Text>
                <Text fontWeight={"700"} color={"white"}>
                  {Number(fromNano(currRewards)).toFixed(5)} NOT
                </Text>
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <Card
          mb={useBreakpointValue({ base: "4%", md: "0%", lg: "0%" })}
          w={useBreakpointValue({ base: "100%", md: "100%", lg: "18vw" })}
          h={"15vh"}
          bg={"#282828"}
          border={"2px solid #3e382a"}
        >
          <CardBody>
            <Flex h="100%" alignItems={"center"} gap={5}>
              <Flex
                alignItems={"center"}
                justifyContent={"center"}
                bg={"#3e382a"}
                borderRadius={"8px"}
                border={"1px solid #826b31"}
                w={useBreakpointValue({ base: "13vw", md: "10vw", lg: "4vw" })}
                h={"7vh"}
              >
                <Icon as={CiDollar} boxSize={8} color={"white"} />
              </Flex>

              <Flex direction={"column"}>
                <Text color={"#cea638"} fontSize={"small"}>
                  TVL{" "}
                </Text>
                <Text fontWeight={"700"} color={"white"}>
                  {/* $ {priceInUsd ? (tvl.toFixed(2) * priceInUsd).toFixed(2) : '0'} */}
                  $0
                </Text>
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <Card
          w={useBreakpointValue({ base: "100%", md: "100%", lg: "18vw" })}
          h={"15vh"}
          bg={"#282828"}
          border={"2px solid #3e382a"}
        >
          <CardBody>
            <Flex h="100%" alignItems={"center"} gap={5}>
              <Flex
                alignItems={"center"}
                justifyContent={"center"}
                bg={"#3e382a"}
                borderRadius={"8px"}
                border={"1px solid #826b31"}
                w={useBreakpointValue({ base: "13vw", md: "10vw", lg: "4vw" })}
                h={"7vh"}
              >
                <Icon as={CiDollar} boxSize={8} color={"white"} />
              </Flex>

              <Flex direction={"column"}>
                <Text color={"#cea638"} fontSize={"small"}>
                  Rewards rate
                </Text>
                <Text fontWeight={"700"} color={"white"}>
                  6%
                </Text>
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </Flex>

      <Flex
        mt={5}
        direction={"column"}
        mb={useBreakpointValue({ base: "20%", md: "0%", lg: "0%" })}
      >
        <Card
          bg={"#282828"}
          color={"white"}
          w={useBreakpointValue({ base: "100%" })}
        >
          <CardBody>
            <Tabs isFitted variant="unstyled">
              <TabList>
                <Tab
                  borderTopLeftRadius={"10px"}
                  _selected={{ color: "black", bg: "#ffc63c" }}
                >
                  Buy NotMiner
                </Tab>
                <Tab
                  borderTopLeftRadius={"10px"}
                  _selected={{ color: "black", bg: "#ffc63c" }}
                >
                  Rewards
                </Tab>
              </TabList>
              <Divider />
              <TabPanels>
                <TabPanel>
                  <Flex direction={"column"}>
                    <Flex
                      justifyContent={"space-between"}
                      gap={useBreakpointValue({
                        base: "5%",
                        md: "0%",
                        lg: "0%",
                      })}
                    >
                      <Input
                        w={"60vw "}
                        placeholder="Enter the amount to deposit"
                        onChange={(e) =>
                          setDepositAmount(Number(e.target.value))
                        }
                      />
                      <Button
                        backgroundColor="#38cedc"
                        color="white"
                        boxShadow="0px 4px 10px rgba(56, 206, 220, 0.5)"
                        _hover={{ backgroundColor: "#32b9c4" }}
                        onClick={() =>
                          referralId
                            ? depositWithReferral(depositAmount, referralId)
                            : stake(depositAmount)
                        }
                      >
                        Buy Now
                      </Button>
                    </Flex>
                  </Flex>
                </TabPanel>

                <TabPanel>
                  <Flex
                    direction={"column"}
                    justifyContent={"center"}
                    bg={"black"}
                    p={5}
                    borderRadius={"10px"}
                    border={"2px solid #ffc63c"}
                  >
                    <Flex direction={"row"} gap={5} justify={"right"}>
                      <Text>REWARD</Text>~
                      <Box>
                        <Text>
                          {Number(fromNano(currRewards)).toFixed(5)} NOT
                        </Text>
                      </Box>
                    </Flex>

                    <Flex
                      mt={useBreakpointValue({
                        base: "7%",
                        md: "6%",
                        lg: "6%",
                      })}
                      alignSelf={useBreakpointValue({
                        base: "center",
                        md: "end",
                        lg: "end",
                      })}
                      gap={3}
                      direction={useBreakpointValue({
                        base: "column",
                        md: "row",
                        lg: "row",
                      })}
                    >
                      <Button
                        backgroundColor="#38cedc"
                        color="white"
                        boxShadow="0px 4px 10px rgba(56, 206, 220, 0.5)"
                        _hover={{ backgroundColor: "#32b9c4" }}
                        onClick={() => compound()}
                      >
                        COMPOUND
                      </Button>

                      <Button
                        backgroundColor="#38cedc"
                        color="white"
                        boxShadow="0px 4px 10px rgba(56, 206, 220, 0.5)"
                        _hover={{ backgroundColor: "#32b9c4" }}
                        onClick={() => claimRewards()}
                      >
                        CLAIM REWARDS
                      </Button>
                    </Flex>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </Flex>

      <Card
        mt={5}
        bg={"#282828"}
        color={"white"}
        display={useBreakpointValue({ base: "none", md: "block", lg: "block" })}
      >
        <CardBody>
          <Flex direction={"column"} gap={5}>
            <Flex justifyContent={"space-between"}>
              <Heading fontSize={"md"}>Transaction History</Heading>

              <Tabs variant="unstyled">
                <TabList border={"1px solid #38cedc"}>
                  <Tab _selected={{ color: "black", bg: "#38cedc" }}>Today</Tab>
                  <Tab _selected={{ color: "black", bg: "#38cedc" }}>
                    7 Days
                  </Tab>
                  <Tab _selected={{ color: "black", bg: "#38cedc" }}>
                    30 Days
                  </Tab>
                  <Tab _selected={{ color: "black", bg: "#38cedc" }}>
                    All Time
                  </Tab>
                </TabList>
              </Tabs>
            </Flex>

            <TableContainer overflowY={"scroll"} maxH={"30vh"}>
              <Table size="sm" variant="unstyled">
                <Thead>
                  <Tr>
                    <Th>Type</Th>
                    <Th>Date</Th>
                    <Th>Address</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody bg={"black"}>
                  <Tr bg={"#3e3e3e"} p={2} borderRadius={"10px"}>
                    <Td>
                      <Box>Buy</Box>
                    </Td>
                    <Td>
                      <Box>2024-05-26</Box>
                    </Td>
                    <Td>
                      <Box>0x123...456</Box>
                    </Td>
                    <Td>
                      <Button
                        bg={"#37c367"}
                        border={"none"}
                        borderRadius={"7px"}
                        color={"white"}
                        fontSize={"smaller"}
                      >
                        Completed
                      </Button>
                    </Td>
                  </Tr>
                  <Tr bg={"#3e3e3e"} p={2} borderRadius={"10px"}>
                    <Td>
                      <Box>Withdraw</Box>
                    </Td>
                    <Td>
                      <Box>2024-05-25</Box>
                    </Td>
                    <Td>
                      <Box>0x789...abc</Box>
                    </Td>
                    <Td>
                      <Button
                        bg={"#ffc63c"}
                        border={"none"}
                        borderRadius={"7px"}
                        color={"white"}
                        fontSize={"smaller"}
                      >
                        Pending
                      </Button>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default Dashboard;
