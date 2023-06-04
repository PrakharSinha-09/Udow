import React from 'react'
import { 
  Container, 
  Box, 
  Text, 
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs } from '@chakra-ui/react'
import Login from '../Components/Authentication/Login'
import Signup from '../Components/Authentication/Signup'
const HomePage = () => {
  return (
    <Container maxW={'xl'} >
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >                                                         {/*Box is Similar to div*/}
        <Text>Udow : Lets Chat!</Text>
      </Box>

      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
      <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage