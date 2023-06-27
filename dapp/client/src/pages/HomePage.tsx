import { Box, Button, Link, Heading, Text, VStack, Image, HStack, Flex, color, Center } from "@chakra-ui/react";
import Navbar from "../components/NavBarComponent";
import SectionLayout from "../layouts/SectionLayout";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import {Footer} from "../components/FooterComponent";

const image = "https://images.unsplash.com/photo-1686446049939-dc067f00b300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDl8cVBZc0R6dkpPWWN8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=60";
const image2 = "https://images.unsplash.com/photo-1486766580538-8bcfe0c2f14e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=427&q=80";
const image3 = "https://images.unsplash.com/photo-1595145035228-8b353145dd75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdXNlJTIwb3V0c2lkZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1000&q=60";
const title = "Propertize";
const subtitle = "Revolutionize the way you manage real estates by leveraging blockchain.";
const ctaLink = "start now!";
const ctaText = "ctaText";
const text = "Our protocol ensures secure and transparent transactions, reduces costs, and streamlines operations while guaranteeing a fast transaction throughput.";

const title2 = "Fast and Cheap";
const subtitle2 = "Propertize uses Aptos as an infrastructure";
const ctaLink2 = "learn more";
const ctaText2 = "ctaText";
const text2 = "Parallel execution & Transaction Dissamenation are layered up to provide high performance.";

export const HomePage = () => {
    const handleStartClick = () => {
        // Redirect to homepage
        window.location.href = '/property';
      }

    return(
        <VStack>
            <Box
                h={"29px"}>
            </Box>

            {/* FIRST SECTION */}
            <SectionLayout color="primary">
                <Box 
                    bgImage={image}
                    bgSize={"105%"}
                    bgPosition='center'
                    bgRepeat='no-repeat'
                    h={"130%"}
                    w={"100%"}
                >
                    <VStack>
                        <Box h={"120px"}></Box>
                        <Heading fontSize={'5xl'} textAlign={"center"} p={"5"} color={"blackAlpha.800"}>
                            Your property as NFT
                        </Heading>
                        <Text fontSize="xl" mt={4} textAlign={"center"} color={"blackAlpha.800"}>
                            Discover the power of web 3.0 technology.
                        </Text>
                        <Center>
                            <Link onClick={handleStartClick}>
                                <Button
                                variant='outline'
                                colorScheme="white"
                                color={"blackAlpha.800"}
                                ringColor={"blackAlpha.800"}
                                _hover={{ color: 'white' }}
                                >
                                Get Started
                                </Button>
                            </Link>
                        </Center>
                    </VStack>
                </Box>
            </SectionLayout>

            {/* SECOND LAYOUT */}

            <SectionLayout color="blackAlpha.200">
                <HStack
                    direction={{ base: 'column', md: 'row' }}
                    justify="space-between"
                    px={8}
                >   
                    <VStack spacing={4}
                    w={{ base: "80%", md: "80%" }}
                    align={["left", "left", "flex-start", "flex-start"]}
                    >
                    <Heading
                        as="h1"
                        size="3xl"
                        fontWeight="bold"
                        textAlign={["left", "left", "left", "left"]}
                        paddingTop={"20"}
                    >
                        {title}
                    </Heading>
                    <Heading
                        as="h2"
                        size="md"
                        color="primary.800"
                        opacity="0.8"
                        fontWeight="normal"
                        lineHeight={1.5}
                        textAlign={["left", "left", "left", "left"]}
                    >
                        {subtitle}
                    </Heading>
                    <Link onClick={handleStartClick}>
                        <Button
                        rightIcon={<ArrowForwardIcon />}
                        variant='outline'
                        colorScheme="primary"
                        bgColor={"#3f67f"}
                        _hover={{ color: '#79fee0' }}
                        >
                        {ctaLink}
                        </Button>
                    </Link>
                    <Text
                        fontSize="xs"
                        mt={2}
                        textAlign="left"
                        color="primary.800"
                        opacity="0.6"
                    >
                        {text}
                    </Text>
                    </VStack>
                        <Box w={{ base: "80%", sm: "60%", md: "50%" }} mb={{ base: 12, md: 0 }}>
                            <Image src={image2} sizes="100%" rounded="1rem" shadow="2xl" />
                        </Box>
                </HStack>
            </SectionLayout>

            {/* THIRD SECTION */}
            <SectionLayout color="primary">
                <HStack
                    maxW="1200px"
                    mx="auto"
                    direction={{ base: 'column', md: 'row' }}
                    justify="space-between"
                    px={8}
                >   
                    <Box w={{ base: "80%", sm: "60%", md: "50%" }} mb={{ base: 12, md: 0 }}>
                        <Image src={image3} sizes="100%" rounded="1rem" shadow="2xl" />
                    </Box>
                    <VStack spacing={4}
                    w={{ base: "80%", md: "40%" }}
                    align="flex-end"
                    >
                    <Heading
                        as="h1"
                        size="xl"
                        fontWeight="bold"
                        color="primary.800"
                        textAlign={"right"}
                    >
                        {title2}
                    </Heading>
                    <Heading
                        as="h2"
                        size="md"
                        color="primary.800"
                        opacity="0.8"
                        fontWeight="normal"
                        lineHeight={1.5}
                        textAlign={["left", "right", "right", "right"]}
                    >
                        {subtitle2}
                    </Heading>
                    <Link 
                    href="https://aptoslabs.com/"
                    isExternal
                    >
                        <Button
                        variant='solid'
                        ml="auto"
                        _hover={{ bgColor: '#79fee0', color:'blackAlpha.800'}}
                        >
                        {ctaLink2}
                        </Button>
                    </Link>
                    <Text
                        fontSize="xs"
                        mt={2}
                        textAlign="right"
                        opacity="0.6"
                        paddingLeft={"10"}
                    >
                        {text2}
                    </Text>
                    </VStack>
                </HStack>
            </SectionLayout>
        </VStack>
    )
};