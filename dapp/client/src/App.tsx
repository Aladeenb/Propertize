import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Heading,
  Stack,
  Divider,
  VStack,
  Alert,
  AlertIcon,
  Grid,
  theme,
  Flex,
  Spacer,
  ButtonGroup,
  Container,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./components/ColorModeSwitcher"
import { ConnectComponent } from "./components/ConnectComponent"
import { RegistryComponent } from "./components/RegistryComponent"
import { PropertyComponent } from "./components/PropertyComponent"
import FractionalShareComponent from "./components/FractionalShareComponent"

export const App = () => (
  <ChakraProvider theme={theme}>

    {/*Tab bar*/}
    <Grid  p={3}>  
      <Flex minWidth='max-content' alignItems='center' gap='2'>
        <Box p='2'>
          <Heading>Propertize</Heading>
        </Box>
        <Spacer />
        <ButtonGroup gap='2'>
          <ConnectComponent />
          <Alert status='warning'>
              <AlertIcon />
                <Text fontSize="xs">
                Only Petra is supported!
              </Text>
            </Alert>
          <ColorModeSwitcher justifySelf="flex-end" />
        </ButtonGroup>
      </Flex>
    </Grid>

    <Stack
      spacing="4"
      align={"center"}
    >
      {/*Property*/}
      <Container>
        <Box 
          padding='4'
          shadow='md' 
          borderWidth='2px'
          borderRadius={"10"}
          >
          <Heading fontSize='xl'>Property</Heading>
          <PropertyComponent/>
        </Box>
      </Container>

      {/*Fractional Share*/}
      <Container>
        <Box
          padding='4'
          shadow='md' 
          borderWidth='2px'
          borderRadius={"10"}
          >
          <Heading fontSize='xl'>Fractional Share</Heading>
          <FractionalShareComponent/>
        </Box>
      </Container>

      {/*Registry*/}
      <Container>
        <Box 
            padding='4'
            shadow='md' 
            borderWidth='2px'
            borderRadius={"10"}
            >
            <Heading fontSize='xl'>Registry</Heading>
            <RegistryComponent/>
        </Box>
      </Container>
    </Stack>
  </ChakraProvider>
)
