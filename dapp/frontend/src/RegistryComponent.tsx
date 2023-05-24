import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useEffect } from "react";
import {  
  Button, 
  Center, 
  ButtonGroup,
  List,
  ListItem,
  Link,
  Stack,
  Box,
  InputGroup,
  Input,
  InputRightElement,
  Text,
  HStack,
  VStack,
  Heading
} from '@chakra-ui/react';
import { MODULE_ADDRESS, PROVIDER } from './constants';
import { Spin } from 'antd';

type RegisteredProperty = {
  property_address: string;
  owner_address: string;
  timestamp_seconds: number; //TODO: enforce this to be uint64
};


export const RegistryComponent = () => {
  // Component logic and state can be defined here
  const { account, signAndSubmitTransaction } = useWallet();

  //
  // States
  //
  const [accountHasRegistry, setAccountHasRegistry] = useState<boolean>(false);
  const [propertyAdded, setPropertyAdded] = useState<boolean>(false);
  const [registeredProperties, setRegisteredProperties] = useState<RegisteredProperty[]>([]);
  const [newRegisterProperty, setNewRegisterProperty] = useState<string>("");
  /// spinner
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);

  const onRegisterProperty = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewRegisterProperty(value);
  }

  const fetchRegistry = async () => {
    if (!account) return [];
    try {
      const RegistryResource = await PROVIDER.getAccountResource(
        account?.address,
        `${MODULE_ADDRESS}::registry::Registry`,
      )
      setAccountHasRegistry(true);

      // registry table handle
      const tableHandle = (RegistryResource as any).data.properties.handle;
      
      // Table struct from the module
      // properties_list: Table<address, RegisteredProperty>
      let registeredProperties = [];
      let counter = 1;

      while (counter <= 3){
        const tableItem = {
          key_type: "address",
          value_type: `${MODULE_ADDRESS}::registry::registeredProperty`,
          key: `${counter}`,
        };
        const registeredProperty = await PROVIDER.getTableItem(tableHandle, tableItem);
        registeredProperties.push(registeredProperty);
        counter++;
      }
      
      // set properties in local state
      setRegisteredProperties(registeredProperties);
    } 
    catch (e: any) {
      //setAccountHasRegistry(false);
    }
  };

  //
  // Effects
  //
  useEffect(() => {
    fetchRegistry();
  }, [account?.address, fetchRegistry]);
  
  //
  // Functions
  //

  /// addNewRegistry
  const addNewRegistry = async () => {
    if(!account) return [];
    setTransactionInProgress(true);

    // transaction payload to be submitted
    const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::registry::Init_registry`, // TODO: Init_registry -> init_registry
        type_arguments: [],
        arguments: [],
    };
    try {
        // sign and submit tx to chain
        const response = await signAndSubmitTransaction(payload);
        
        // wait for transaction
        await PROVIDER.waitForTransaction(response.hash);
        setAccountHasRegistry(true);
        
    } catch (error: any) {
      //setAccountHasRegistry(false); 
    } finally {
      setTransactionInProgress(false);
    }
  }

  /// registerProperty
  const onPropertyRegistered = async () => {
    // check for connected account
    if (!account) return;
    setTransactionInProgress(true);

    // tx payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::registry::register_property`,
      type_arguments: [],
      arguments: [newRegisterProperty],
    }

    // object to be stored into local state
    const newRegisterPropertyToPush = {
      property_address: newRegisterProperty,
      owner_address: account.address,
      timestamp_seconds: 0, // TODO: get timestamp
    };

    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await PROVIDER.waitForTransaction(response.hash);

      // create new array based on current state
      let newRegisterProperties = [...registeredProperties];

      // add item to the array
      newRegisterProperties.push(newRegisterPropertyToPush);

      // set state
      setRegisteredProperties(newRegisterProperties);

      // clear input
      setNewRegisterProperty("");
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setTransactionInProgress(false);
    }
  }

  //
  // Render
  //
  // TODO: update UI
  return (
    // TSX markup defines the component's UI
    <Spin spinning={transactionInProgress}>
      <Center>
      {!accountHasRegistry ? (
        <ButtonGroup>
          <Button
          onClick={addNewRegistry}
          variant='outline'
          _hover={{ backgroundColor: "teal" }}
        >
          Create Registry
        </Button>
        </ButtonGroup>
        ) : (
          registeredProperties && (
            <VStack 
              spacing={"10"}
              align={"Center"}
            >
              <List>
                <Heading size='xs'>
                  Registry list 
                </Heading>
                {
                  registeredProperties.map((registeredProperty) => (
                    <ListItem 
                    key={registeredProperty.owner_address}
                    title={registeredProperty.property_address}
                    >
                      <HStack>
                        <Text>
                          {registeredProperty.property_address}
                        </Text>
                        <Link 
                        href={`https://explorer.aptoslabs.com/account/${registeredProperty.property_address}/`}
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
                {/*TODO: make this a popover*/}
                <Text>Register Property:</Text>
                <InputGroup size='md'>
                  <Input
                    pr='4.5rem'
                    onChange={(event) => onRegisterProperty(event)}
                    placeholder='Enter property address'
                    value={newRegisterProperty}
                    //type={}
                  />
                  <InputRightElement width='4.5rem'>
                    <Button
                      h='1.75rem' 
                      size='sm'
                      onClick={onPropertyRegistered}
                    >
                      Register
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
            </VStack>
          )
        )
      }
      </Center>
    </Spin>
    
    
  );
  /* TODO: include this in a seperate box*/
};
  
  export default RegistryComponent;