import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React, { useState, useEffect } from "react";
import { Spin } from 'antd';
import { 
  Box,
  Stack, 
  Button, 
  Input,
  ButtonGroup,
  InputGroup,
  InputRightElement,
  Text,
  List,
  ListItem,
  Heading,
  HStack,
  Link,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverHeader,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Center,
} from '@chakra-ui/react';
import { MODULE_ADDRESS, PROVIDER, client, faucetClient, tokenClient } from '../constants';

type Property = {
  owner_address: string;
  name: string;
  description: String;
  uri: string;
}


export const PropertyComponent = () => {
  // Component logic and state can be defined here
  const { account, signAndSubmitTransaction } = useWallet();

  //
  // State
  //

  /// Property 
  const [accountHasProperty, setAccountHasProperty] = useState<boolean>(false); //TODO: important for managing property
  
  const [createdProperties, setCreatedProperties] = useState<Property[]>([]);
  const [newPropertyName, setNewPropertyName] = useState<string>("");
  const [newPropertyDescription, setNewPropertyDescription] = useState<string>("");
  const [newPropertyUri, setNewPropertyUri] = useState<string>("");
  
  /// spinner
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);

  // Property related
  const onCreatePropertyName = (
    eventName: React.ChangeEvent<HTMLInputElement>
    ) => {
    const valueName = eventName.target.value;
    setNewPropertyName(valueName);
  };
  const onCreatePropertyDescription = (eventDescription: React.ChangeEvent<HTMLInputElement>) => {
    const valueDescription = eventDescription.target.value;
    setNewPropertyDescription(valueDescription);
  };
  const onCreatePropertyUri = (eventUri: React.ChangeEvent<HTMLInputElement>) => {
    const valueUri = eventUri.target.value;
    setNewPropertyUri(valueUri)
  };

  //
  // Functions
  //

  // creates a property
  const onPropertyCreated = async () => {
    // Return nothing if no account is connected
    if (!account) return;

    setTransactionInProgress(true);

    // Build tx payload
    const payload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::property::create_property_collection`,
      type_arguments: [],
      arguments: [
        newPropertyDescription,
        newPropertyName,
        newPropertyUri
      ],
  };

  // build new property to push into local state
  const newPropertyToPush = {
    owner_address: account.address,
    description: newPropertyDescription,
    name: newPropertyName,
    uri: newPropertyUri
  };

  try {
    // sign and submit tx to chain
    const response = await signAndSubmitTransaction(payload);
    // wait for transaction
    await PROVIDER.waitForTransaction(response.hash);
    setAccountHasProperty(true);
    // create an array based on the current state
    let newProperties = [...createdProperties];

    // add the new property to the array
    newProperties.push(newPropertyToPush);

    // set state
    setCreatedProperties(newProperties);

    // clear inputs
    setNewPropertyDescription("");
    setNewPropertyName("");
    setNewPropertyUri("");
  } catch (error: any) {
    console.log("error", error);
    } finally {
      setTransactionInProgress(false);
    }
  }

  /// TODO: Get Property address

  const getMetadata = async () => {
    const collectionData = await tokenClient.getCollectionData(MODULE_ADDRESS, newPropertyName);
    console.log(`Alice's collection: ${JSON.stringify(collectionData, null, 4)}`);
  }

  //
  // Render
  //
  return (
    // TSX markup defines the component's UI
    <Spin spinning={transactionInProgress}>
      <Center>
        {
            createdProperties && (
              <VStack 
              spacing={"10"}
              align={"Center"}
            >
              {/*TODO: add a popover, like in the fractional share list*/}
              <List>
                <Heading size='xs'>
                  Property list 
                </Heading>
                {
                  createdProperties.map((newProperties) => (
                    <ListItem 
                    key={newProperties.name}
                    // title={newProperties.description}
                    >
                      <HStack>
                        <Text>
                          {newProperties.name}
                        </Text>
                        <Link 
                        href={`https://explorer.aptoslabs.com/account/${newProperties.owner_address}/`}
                        isExternal
                        >
                          view on Explorer
                        </Link>
                      </HStack>
                    </ListItem>
                  ))
                }
              </List>
              <Box>
                {/*TODO: make a property list*/}
                <Stack spacing={2}>
                  {/*TODO: make this a popover*/}
                  {/*NAME*/}
                  
                    <Input
                      pr='4.5rem'
                      onChange={(eventName) => onCreatePropertyName(eventName)}
                      placeholder='name'
                      value={newPropertyName}
                      //type={}
                    />                 

                    {/*DESCRIPTION*/}
                    <Input
                      pr='4.5rem'
                      onChange={(eventDescription) => onCreatePropertyDescription(eventDescription)}
                      placeholder='description'
                      value={newPropertyDescription}
                      //type={}
                    />          

                    {/*URI*/}
                    <Input
                      pr='4.5rem'
                      onChange={(eventUri) => onCreatePropertyUri(eventUri)}
                      placeholder='uri'
                      value={newPropertyUri}
                      //type={}
                    />          
                    <Button
                      fontSize={"xx-small"}
                      onClick={onPropertyCreated}
                    >
                      Create
                    </Button>
                </Stack>
              </Box>
            </VStack>
            )
        }
      </Center>
    </Spin>
  );
};
  
  export default PropertyComponent;