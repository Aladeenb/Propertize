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
  Flex,
  Grid,
  useColorModeValue,
  FormControl,
  FormErrorMessage,
  FormLabel
} from '@chakra-ui/react';
import { MODULE_ADDRESS, PROVIDER } from '../constants';
import { CardItem, CardListProperty } from "./Card/CardListProperty";
import { useForm } from "react-hook-form";


type Property = {
  owner_address: string;
  name: string;
  description: String;
  uri: string;
}


export const PropertyComponent = () => {
  // Component logic and state can be defined here
  const { account, signAndSubmitTransaction } = useWallet();
  const { handleSubmit, register, formState: { errors } } = useForm();

  //
  // State
  //

  /// Property 
  const [accountHasProperty, setAccountHasProperty] = useState<boolean>(false); //TODO: important for managing property
  
  const [createdProperties, setCreatedProperties] = useState<Property[]>([]);
  const [newPropertyName, setNewPropertyName] = useState<string>("");
  const [newPropertyDescription, setNewPropertyDescription] = useState<string>("");
  const [newPropertyUri, setNewPropertyUri] = useState<string>("");
  
  // Card Item
  const [properties, setProperties] = useState<CardItem[]>([]);

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

  const borderBgColor = useColorModeValue('red', 'blue');

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
  const newProperty: CardItem = {
    ownerAddress: account.address,
    name: newPropertyName,
    description: newPropertyDescription,
    uri: newPropertyUri,
  }

  try {
    // sign and submit tx to chain
    const response = await signAndSubmitTransaction(payload);
    // wait for transaction
    await PROVIDER.waitForTransaction(response.hash);
    setAccountHasProperty(true);

    // set state and add the new property to the array
    setProperties((prevProperties) => [...prevProperties, newProperty]);

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

  //
  // Render
  //
  return (
    // TSX markup defines the component's UI
    <Spin spinning={transactionInProgress}>
      <div
        >
        {
            createdProperties && (
              <Stack  
                w={"95vw"} 
                p={0}
                align={"center"}
              >  
                        
              <Center
                w={"40vw"} 
                h={"30vw"}
                bgColor={{borderBgColor}} 
                overflow={"auto"}
                borderRadius={10}
                borderWidth={2}
                borderColor={"#3f67ff"}
              >
                <Stack>
                  {/*TODO: make this a popover*/}
                  {/*NAME*/}
                  
                    <Input
                      pr='4.5rem'
                      onChange={(eventName) => onCreatePropertyName(eventName)}
                      placeholder='name'
                      value={newPropertyName}
                      focusBorderColor="#3f67ff"
                      //type={}
                    />                 

                    {/*DESCRIPTION*/}
                    <Input
                      pr='4.5rem'
                      onChange={(eventDescription) => onCreatePropertyDescription(eventDescription)}
                      placeholder='description'
                      value={newPropertyDescription}
                      focusBorderColor="#3f67ff"
                      //type={}
                    />          

                    {/*URI*/}
                    <Input
                      pr='4.5rem'
                      onChange={(eventUri) => onCreatePropertyUri(eventUri)}
                      placeholder='uri'
                      value={newPropertyUri}
                      focusBorderColor="#3f67ff"
                      //type={}
                    />          
                    <Button
                      fontSize={"xx-small"}
                      onClick={onPropertyCreated}
                      bgColor={"blackAlpha.400"}
                    >
                      Create
                    </Button>
                </Stack>
              </Center>
                 
                           
              {/*PROPERTY CARDLIST*/}
              <Center paddingTop={6} >
                <VStack spacing={0}>
                  <Heading size='md' textAlign={"center"}>
                    My Properties 
                  </Heading>
                  <Box 
                  w={"40vw"} 
                  h={"55vw"}
                  
                  overflow={"auto"}

                  transform={`scale(0.8)`}
                  >
                    <CardListProperty items={properties} /> 
                  </Box>  
                </VStack>   
              </Center>                     
          </Stack>
            )
            
        }
      </div>
    </Spin>
  );
};
  
  export default PropertyComponent;