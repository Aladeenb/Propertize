import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React, { useState, useEffect } from "react";
import { Spin } from 'antd';
import { 
  Box, 
  Button, 
  Input,
  InputGroup,
  InputRightElement,
  Text
} from '@chakra-ui/react';
import { MODULE_ADDRESS, PROVIDER } from './constants';

type Property = {
  name: string;
  location: string;
  description: String;
  uri: string;
}

export const PropertyComponent = () => {
  // Component logic and state can be defined here
  const { account, signAndSubmitTransaction } = useWallet();

  //
  // State
  //
  const [showForm, setShowForm] = useState(false);
  const [accountHasProperty, setaccountHasProperty] = useState<boolean>(false); //TODO: important for managing property

  /// Property args 
  const [newPropertyName, setNewPropertyName] = useState<string>("");
  const [newPropertyLocation, setNewPropertyLocation] = useState<string>("");
  const [newPropertyDescription, setNewPropertyDescription] = useState<string>("");
  const [newPropertyUri, setNewPropertyUri] = useState<string>("");
  
  /// spinner
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  
  //
  // Effects
  //

  
  //
  // Functions
  //
  const onCreatePropertyName = (
    eventName: React.ChangeEvent<HTMLInputElement>
    ) => {
    const valueName = eventName.target.value;
    setNewPropertyName(valueName);
  };

  const onCreatePropertyLocation = (eventLocation: React.ChangeEvent<HTMLInputElement>) => {
    const valueLocation = eventLocation.target.value;
    setNewPropertyLocation(valueLocation);
  };
  const onCreatePropertyDescription = (eventDescription: React.ChangeEvent<HTMLInputElement>) => {
    const valueDescription = eventDescription.target.value;
    setNewPropertyDescription(valueDescription);
  };
  const onCreatePropertyUri = (eventUri: React.ChangeEvent<HTMLInputElement>) => {
    const valueUri = eventUri.target.value;
    setNewPropertyUri(valueUri)
  };

  const onPropertyCreated = async () => {
    // Return nothing if no account is connected
    if (!account) return;

    setTransactionInProgress(true);

    // Build tx payload
    const payload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::property::mint_property`,
      type_arguments: [],
      arguments: [
        newPropertyName,
        newPropertyLocation,
        newPropertyDescription,
        newPropertyUri
      ],
  };
  try {
      // sign and submit tx to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await PROVIDER.waitForTransaction(response.hash);
  } catch (error: any) {
    console.log("error", error);
  } finally {
    setTransactionInProgress(false);
  }
  }

  //
  // Render
  //
  return (
    // TSX markup defines the component's UI
    <Spin spinning={transactionInProgress}>
      <Box>
        {/*TODO: make this a popover*/}
        <Text>Create Property:</Text>

        {/*NAME*/}
        <InputGroup size='md'>
          <Input
            pr='4.5rem'
            onChange={(eventName) => onCreatePropertyName(eventName)}
            placeholder='name'
            value={newPropertyName}
            //type={}
          />          

          {/*LOCATION*/}
          <Input
            pr='4.5rem'
            onChange={(eventLocation) => onCreatePropertyLocation(eventLocation)}
            placeholder='location'
            value={newPropertyLocation}
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
        </InputGroup>
      </Box>

      {accountHasProperty && (
        <Box flex={8} mx="auto">
            <Button
            variant='outline'
            _hover={{ backgroundColor: "teal" }}
            >
            Manage Property
            </Button>
        </Box>
      )}
    </Spin>
  );
};
  
  export default PropertyComponent;