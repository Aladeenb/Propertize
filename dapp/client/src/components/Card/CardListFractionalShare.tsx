import { Center, Stack, VStack, Grid, Image, GridItem, Box, Heading, Text, Link, Flex, useColorModeValue, Badge, HStack } from "@chakra-ui/react";

export interface CardItem {
    ownerAddress: string;
    propertyName: string;
    name: string;
    description: string;
    uri: string;
  }
  
  interface CardListProps {
    items: CardItem[];
  }
  
  export const CardListFractionalShare: React.FC<CardListProps> = (props) => {
    const { items } = props;

    return (
      
        <Grid templateColumns='repeat(5, 1fr)' gap={0}>
        {items.map((item, index) => (
          <GridItem key={index} >
            <Center>
              <Box
                role={'group'}
                p={6}
                w={'300px'}
                bg={'grey.50'}
                boxShadow={'2xl'}
                rounded={'lg'}
                pos={'relative'}
                zIndex={1}
                transform={`scale(0.8)`}
                >
                
                <Box
                  rounded={'lg'}
                  mt={-12}
                  pos={'relative'}
                  height={'230px'}
                  _after={{
                    transition: 'all .3s ease',
                    content: '""',
                    w: 'full',
                    h: 'full',
                    pos: 'absolute',
                    top: 5,
                    left: 0,
                    backgroundImage: `url(${item.uri})`,
                    filter: 'blur(15px)',
                    zIndex: -1,
                  }}
                  _groupHover={{
                    _after: {
                      filter: 'blur(20px)',
                    },
                  }}>
                  <Image
                    rounded={'lg'}
                    height={230}
                    width={282}
                    objectFit={'cover'}
                    src={item.uri}
                  />
                </Box>
                <Stack pt={10} align={'center'}>
                  <HStack>
                    <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
                      {item.propertyName}
                    </Text>
                    <Badge variant='subtle' colorScheme='green'>
                      New
                    </Badge>
                  </HStack>
                  <Heading fontWeight={800} fontSize={'3xl'}>
                      {item.name}
                    </Heading>
                  <VStack direction={'row'} align={'center'}>
                    <Text fontSize={'md'}>
                      {item.description}
                    </Text>
                    <Link 
                      href={`https://explorer.aptoslabs.com/account/${item.ownerAddress}/`}
                      isExternal
                      color={"gray.600"}
                      >
                          view on Explorer
                    </Link>
                  </VStack>
                </Stack>
              </Box>
            </Center>
          </GridItem>
        ))}
        {/* Add a notification */}
      </Grid>
    );
  };