import React from 'react';
import {
  Card,
  CardBody,
  Flex,
  Text,
  Icon,
  Box,
  Divider,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Input,
  Button
} from "@chakra-ui/react";
import { TonConnectButton } from '@tonconnect/ui-react';
import { CiDollar } from "react-icons/ci";

const Dashboard = ({ isCollapsed }) => {
  return (
    <Flex
      direction={'column'}
      minH={'100vh'}
      minW={isCollapsed ? '95vw' : '80vw'}
      bg={'black'}
      color={'white'}
      p={5}
      transition={'min-width 0.3s'}
      
    >
      <Flex justifyContent={'space-between'} p={3}> 
        <Text fontSize={'x-large'}>Stake</Text>
        <TonConnectButton />
      </Flex>
      <Divider />

      <Flex mt={5} justifyContent={'space-between'} direction={['column', 'column', 'row', 'row']}>
        <Card w={'18vw'} h={'15vh'} bg={'#282828'} border={'2px solid #3e382a'}> 
          <CardBody>
            <Flex  h="100%" alignItems={'center'} gap={5}>
              <Flex alignItems={'center'} justifyContent={'center'}  bg={'#3e382a'}borderRadius={'8px'} border={'1px solid #826b31'} w={'4vw'} h={'7vh'}>
                <Icon as={CiDollar} boxSize={8} color={'white'} />
              </Flex>

              <Flex direction={'column'} >
                <Text color={'#cea638'} fontSize={'small'}>$NOT Price</Text>
                <Text fontWeight={'700'} color={'white'}>$2.567400</Text>
              </Flex>
            </Flex>
          </CardBody>
        </Card>

          <Card w={'18vw'} h={'15vh'} bg={'#282828'} border={'2px solid #3e382a'}> 
          <CardBody>
            <Flex  h="100%" alignItems={'center'} gap={5}>
              <Flex alignItems={'center'} justifyContent={'center'}  bg={'#3e382a'}borderRadius={'8px'} border={'1px solid #826b31'} w={'4vw'} h={'7vh'}>
                <Icon as={CiDollar} boxSize={8} color={'white'} />
              </Flex>

              <Flex direction={'column'} >
                <Text color={'#cea638'} fontSize={'small'}>Total $NOT Supply</Text>
                <Text fontWeight={'700'} color={'white'}>430000</Text>
              </Flex>
            </Flex>
          </CardBody>
        </Card>

          <Card w={'18vw'} h={'15vh'} bg={'#282828'} border={'2px solid #3e382a'}> 
          <CardBody>
            <Flex  h="100%" alignItems={'center'} gap={5}>
              <Flex alignItems={'center'} justifyContent={'center'}  bg={'#3e382a'}borderRadius={'8px'} border={'1px solid #826b31'} w={'4vw'} h={'7vh'}>
                <Icon as={CiDollar} boxSize={8} color={'white'} />
              </Flex>

              <Flex direction={'column'} >
                <Text color={'#cea638'} fontSize={'small'}>Total staked $NOT </Text>
                <Text fontWeight={'700'} color={'white'}>127400</Text>
              </Flex>
            </Flex>
          </CardBody>
        </Card>

          <Card w={'18vw'} h={'15vh'} bg={'#282828'} border={'2px solid #3e382a'}> 
          <CardBody>
            <Flex  h="100%" alignItems={'center'} gap={5}>
              <Flex alignItems={'center'} justifyContent={'center'}  bg={'#3e382a'}borderRadius={'8px'} border={'1px solid #826b31'} w={'4vw'} h={'7vh'}>
                <Icon as={CiDollar} boxSize={8} color={'white'} />
              </Flex>

              <Flex direction={'column'} >
                <Text color={'#cea638'} fontSize={'small'}>Rewards rate</Text>
                <Text fontWeight={'700'} color={'white'}>8%</Text>
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </Flex>


      <Flex mt={5} direction={'column'} >
        <Card bg={'#282828'} color={'white'}>
          <CardBody>
          <Tabs isFitted variant='unstyled'>
  <TabList>
    <Tab borderTopLeftRadius={'10px'} _selected={{ color: 'black', bg: '#ffc63c' }}>Buy Notminer</Tab>
    <Tab borderTopLeftRadius={'10px'} _selected={{ color: 'black', bg: '#ffc63c' }}>Rewards</Tab>
  </TabList>
  <Divider />
  <TabPanels>
    <TabPanel>
      <Flex direction={'column'}>
        <Flex justifyContent={'space-between'}>
          <Input w={'60vw '} placeholder='Enter the amount to stake' />
          <Button
            backgroundColor='#38cedc'
            color='white'
            boxShadow='0px 4px 10px rgba(56, 206, 220, 0.5)'
            _hover={{ backgroundColor: '#32b9c4' }}
          >
            Stake Now
          </Button>
        </Flex>
       
      </Flex>
    </TabPanel>
    <TabPanel>
      <p>two!</p>
    </TabPanel>
     <TabPanel>
      <p>three!</p>
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
