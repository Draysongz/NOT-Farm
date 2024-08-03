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
  const { totalValueLocked, poolValue, farmWalletStatus } = useFarmFactory();
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

  const tvl = Number(fromNano(totalValueLocked));

  const actualValue = poolValue > 0 ? Number(fromNano(poolValue)) - 9460 : 0;

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
        lg: '100vw',
      })}
      bg={"white"}
      color={"black"}
      p={5}
      transition={"min-width 0.3s"}
      boxShadow="0px 4px 10px #0098ea"
    >
      <Flex justifyContent={"space-between"} p={3}>
        <Text fontSize={"x-large"}>SAFETOON</Text>
        <TonConnectButton />
      </Flex>
      <Divider />

      <Flex
        mt={5}
        justifyContent={"space-between"}
        direction={["column", "column", "column", "row"]}
      >
        <Card
          w={useBreakpointValue({ base: "100%", md: "100%", lg: "30vw" })}
          h={"15vh"}
          bg={"white"}
          border={"2px solid #0098ea"}
          mb={useBreakpointValue({ base: "4%", md: "0%", lg: "0%" })}
        >
          <CardBody>
            <Flex h="100%" alignItems={"center"} gap={5}>
              <Flex
                alignItems={"center"}
                justifyContent={"center"}
                bg={"white"}
                borderRadius={"8px"}
                border={"1px solid #826b31"}
                w={useBreakpointValue({ base: "13vw", md: "10vw", lg: "4vw" })}
                h={"7vh"}
              >
                <Icon as={CiDollar} boxSize={8} color={"#0098ea "} />
              </Flex>

              <Flex direction={"column"}>
                <Text color={"black"} fontSize={"small"}>
                  Staked balance
                </Text>
                <Text fontWeight={"700"} color={"black"}>
                  {Number(fromNano(userStakedBalance)).toFixed(2)} ST
                </Text>
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <Card
          w={useBreakpointValue({ base: "100%", md: "100%", lg: "30vw" })}
          h={"15vh"}
          bg={"white"}
          border={"2px solid #0098ea"}
          mb={useBreakpointValue({ base: "4%", md: "0%", lg: "0%" })}
        >
          <CardBody>
            <Flex h="100%" alignItems={"center"} gap={5}>
              <Flex
                alignItems={"center"}
                justifyContent={"center"}
                bg={"white"}
                borderRadius={"8px"}
                border={"1px solid #826b31"}
                w={useBreakpointValue({ base: "13vw", md: "10vw", lg: "4vw" })}
                h={"7vh"}
              >
                <Icon as={CiDollar} boxSize={8} color={"#0098ea"} />
              </Flex>

              <Flex direction={"column"}>
                <Text color={"#cea638"} fontSize={"small"}>
                  Rewards
                </Text>
                <Text fontWeight={"700"} color={"white"}>
                  {Number(fromNano(currRewards)).toFixed(5)} ST
                </Text>
              </Flex>
            </Flex>
          </CardBody>
        </Card>

       
       

        <Card
          w={useBreakpointValue({ base: "100%", md: "100%", lg: "30vw" })}
          h={"15vh"}
          bg={"white"}
          border={"2px solid #0098ea"}
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
          bg={"white"}
          color={"#282828"}
          w={useBreakpointValue({ base: "100%" })}
        >
          <CardBody>
            <Tabs isFitted variant="unstyled">
              <TabList>
                <Tab
                  borderTopLeftRadius={"10px"}
                   _selected={{ color: "black", bg: "#0098ea" }}
                >
                  Stake Tr300
                </Tab>
                <Tab
                  borderTopLeftRadius={"10px"}
                   _selected={{ color: "black", bg: "#0098ea" }}
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
                        backgroundColor="#0098ea"
                        color="white"
                        boxShadow="0px 4px 10px #0098ea"
                        _hover={{ backgroundColor: "#0098ea" }}
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
                  _selected={{ color: "black", bg: "#0098ea" }}
                >
                  Stake Reve
                </Tab>
                <Tab
                  borderTopLeftRadius={"10px"}
                   _selected={{ color: "black", bg: "#0098ea" }}
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
                       backgroundColor="#0098ea"
                        color="white"
                        boxShadow="0px 4px 10px #0098ea"
                        _hover={{ backgroundColor: "#0098ea" }}
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
                  _selected={{ color: "black", bg: "#0098ea" }}
                >
                  Stake Whynot
                </Tab>
                <Tab
                  borderTopLeftRadius={"10px"}
                   _selected={{ color: "black", bg: "#0098ea" }}
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
                        backgroundColor="#0098ea"
                        color="white"
                        boxShadow="0px 4px 10px #0098ea"
                        _hover={{ backgroundColor: "#0098ea" }}
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
    </Flex>
  );
};

export default Dashboard;
