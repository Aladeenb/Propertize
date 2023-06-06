import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React, { useState, useEffect } from "react";
import { Spin } from 'antd';
import { 
  Box,
  Stack, 
  Button, 
  Input,
  InputGroup,
  InputRightElement,
  Text,
  List,
  ListItem,
  Heading,
  HStack,
  Link,
  Popover,
  PopoverTrigger,
  PopoverHeader,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from '@chakra-ui/react';
import { MODULE_ADDRESS, PROVIDER } from '../constants';
//import { getTokenAddress } from "../api";
import 'types';
import { AptosClient, Types } from "aptos";

export const FractionalShareComponent = () => {
  // Component logic and state can be defined here
  const { account, signAndSubmitTransaction } = useWallet();

  type Token = {
    property: string;
    name: string;
    description: string;
    uri: string;
  } 

  //
  // State
  //

  /// Fractional Share
  const [accountHasToken, setaccountHasToken] = useState<boolean>(false); //TODO: important for managing property
  const [createdTokens, setCreatedTokens] = useState<Token[]>([]);

  const [newCollectionName, setNewCollectionName] = useState<string>("");
  const [newTokenDescription, setNewTokenDescription] = useState<string>("");
  const [newTokenName, setNewTokenName] = useState<string>("");
  const [newTokenUri, setNewTokenUri] = useState<string>("");

  const [newNoViewAddressToken, setNewNoViewAddressToken] = useState<NoViewAddressToken>();

  //const [newGetTokenAddress, setNewGetTokenAddress] = useState<string>("");
  const [newCreatedToken, setNewCreatedToken] = useState<string>("");
  
  /// spinner
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  
  //
  // Effects
  //

  // Fractional Share Token related
  const onCreateCollectionName = (eventCollectionName: React.ChangeEvent<HTMLInputElement>) => {
    const valueCollectionName = eventCollectionName.target.value;
    setNewCollectionName(valueCollectionName);
  };

  const onCreateTokenDescription = (eventTokenDescription: React.ChangeEvent<HTMLInputElement>) => {
    const valueTokenDescription = eventTokenDescription.target.value;
    setNewTokenDescription(valueTokenDescription);
  };

  const onCreateTokenName = (eventTokenName: React.ChangeEvent<HTMLInputElement>) => {
    const valueTokenName = eventTokenName.target.value;
    setNewTokenName(valueTokenName);
  };

  const onCreateTokenUri = (eventTokenUri: React.ChangeEvent<HTMLInputElement>) => {
    const valueTokenUri = eventTokenUri.target.value;
    setNewTokenUri(valueTokenUri);
  };

  /// TODO: Get Property address

  /// Get a Token's address
  const getTokenAddress = async () => {
    // check for connected account
    if (!account) return;
    setTransactionInProgress(true);
    const client = new AptosClient(nodeUrl); 
    const token = {
      
    }
       
    const payload: Types.ViewRequest = {
      function: `${MODULE_ADDRESS}::property::view_fractional_share_token_address`,
      type_arguments: [],
      arguments: [token],
    }; 
    const response = await client.view(payload);
    return response[0] as any;
  }

  /// creates a fractional share token
  const onTokenCreated = async () => {
    // check for connected account
    if (!account) return;
    setTransactionInProgress(true);

    // tx payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::property::mint_fractional_share_token`,
      type_arguments: [],
      arguments: [
        newCollectionName,
        newTokenDescription,
        newTokenName,
        newTokenUri,
      ],
    }

    // object to be stored into local state
    const newCreatedTokenToPush = {
      collectionName: newCollectionName,
      description: newTokenDescription,
      name: newTokenName,
      uri: newTokenUri,
      tokenAddress: '0x1',
    };

    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await PROVIDER.waitForTransaction(response.hash);

      // create new array based on current state
      let newCreatedTokens = [...createdTokens];

      // add item to the array
      newCreatedTokens.push(newCreatedTokenToPush);

      // set state
      setCreatedTokens(newCreatedTokens);

      // clear input
      setNewCreatedToken("");
      setaccountHasToken(true);
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setTransactionInProgress(false);
    }
  }

  /// Transfer Token
  

  //
  // Render
  //
  return (
    // TSX markup defines the component's UI
    <Spin spinning={transactionInProgress}>
      {/*Fractional Share Token*/}
      <Stack>
        {/*TODO: make this a popover*/}
        <Text>Create Fractional Share Token:</Text>

        {/*COLLECTION NAME*/}
        {/*TODO: Make this a list to choose from */}
        <Input
        pr='4.5rem'
        onChange={(eventCollectionName) => onCreateCollectionName(eventCollectionName)}
        placeholder='Property'
        value={newCollectionName}
        //type={}
        /> 

    {/*TOKEN NAME*/}
        <Input
        pr='4.5rem'
        onChange={(eventCollectionName) => onCreateTokenName(eventCollectionName)}
        placeholder='token name'
        value={newTokenName}
        //type={}
        />

        {/*TOKEN DESCRIPTION*/}
        <Input
        pr='4.5rem'
        onChange={(eventTokenDescription) => onCreateTokenDescription(eventTokenDescription)}
        placeholder='description'
        value={newTokenDescription}
        //type={}
        />          

        {/*URI*/}
        <Input
        pr='4.5rem'
        onChange={(eventTokenUri) => onCreateTokenUri(eventTokenUri)}
        placeholder='uri'
        value={newTokenUri}
        //type={}
        />

        {/* SUBMIT TOKEN*/}          
        <Button
        fontSize={"xx-small"}
        onClick={onTokenCreated}
        >
        Create
        </Button>

        {/* VIEW TOKEN ADDRESS*/}          
        <Button
        fontSize={"xx-small"}
        onClick={getTokenAddress}
        >
        View 
        </Button>
      </Stack>

      {accountHasToken && (
        <Box flex={8} mx="auto">
            <Button
            variant='outline'
            _hover={{ backgroundColor: "teal" }}
            >
            Manage Property
            </Button>
            <Popover>
              <PopoverTrigger>
                <Box>
                  <List>
                    <Heading size='xs'>
                      Fractional Shares list 
                    </Heading>
                    {
                      createdTokens.map((newCreatedTokenToPush) => (
                        <ListItem 
                        key={newCreatedTokenToPush.tokenAddress}
                        title={newCreatedTokenToPush.name}
                        >
                          <HStack>
                            <Text>
                              {newCreatedTokenToPush.name}
                            </Text>
                            <Link 
                            href={`https://explorer.aptoslabs.com/account/${newCreatedTokenToPush.tokenAddress}/`}
                            isExternal
                            >
                              view on Explorer
                            </Link>
                          </HStack>
                        </ListItem>
                      ))
                    }
                  </List>
                </Box>
              </PopoverTrigger>
              <PopoverContent bg='orange' color='white'>
                <PopoverHeader fontWeight='semibold'>Register required</PopoverHeader>
                <PopoverCloseButton/>
                <PopoverBody>
                  These fractional shares are not registered yet.
                  You will need to register them before proceeding.
                </PopoverBody>
            </PopoverContent>
            </Popover>
        </Box>
        
      )}
    </Spin>
  );
};
  
  export default FractionalShareComponent;