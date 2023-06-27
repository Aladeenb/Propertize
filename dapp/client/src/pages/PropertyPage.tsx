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
  Center,
  HStack
} from "@chakra-ui/react"
import { RegistryComponent } from "../components/RegistryComponent"
import { PropertyComponent } from "../components/PropertyComponent"
import FractionalShareComponent from "../components/FractionalShareComponent"
import SectionLayout  from "../layouts/SectionLayout";

export const PropertyPage = () => (
  <ChakraProvider theme={theme}>
    <VStack>
    <Box
        h={"50px"}>
    </Box>

    {/*Property*/}
    <Flex
      h={"750px"}
      w={"100%"}
      bgColor={"primary"}
    >
      <Box flex="1">
        <VStack align={"center"}>
          <Heading fontSize='xl'>Properties</Heading>
          <PropertyComponent/>
        </VStack> 
      </Box>
    </Flex>

      {/*Fractional Share*/}
      <Flex
      h={"750px"}
      w={"100%"}
      bgColor={"blackAlpha.100"}
    >
      <Box flex="1">
        <VStack align={"center"}>
          <Heading fontSize='xl' p={3}>Fractional Shares</Heading>
          <FractionalShareComponent/>
        </VStack> 
      </Box>
    </Flex>

      {/*Registry*/}
      <SectionLayout color="primary">
        <VStack>
            <Heading fontSize='xl'>Registry</Heading>
            <RegistryComponent/>
        </VStack>
      </SectionLayout>
        </VStack>
  </ChakraProvider>
)
