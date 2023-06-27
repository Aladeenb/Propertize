import React, { useState } from 'react';
import { Flex, Box, Text, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody, Center, VStack, Icon, createIcon, Button, Menu, MenuList, MenuItem, MenuButton} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import  logo  from '../pictures/logo192.png';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ConnectComponent } from './ConnectComponent';

export const Navbar = () => {

  const handleLogoClick = () => {
    // Redirect to homepage
    window.location.href = '/';
  }

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMouseEnter = () => {
    setIsCollapsed(true);
  };

  const handleMouseLeave = () => {
    setIsCollapsed(false);
  };


  return (
    <VStack>
      <Flex
      as="nav"
      align="center"
      justify="space-between"
      bgColor="blackAlpha.800"
      padding={3}
      flexWrap="wrap"
      position="fixed"
      backdropFilter="blur(8px)"
      top={0}
      left={0}
      right={0}
      zIndex={990}
    >
      <IconButton 
        aria-label={'Logo'}
        icon={<img src={logo} alt="Logo" style={{ width: '25px', height: 'auto' }}/>}
        size="xs"
        variant={"link"}
        onClick={handleLogoClick}
        color={"whiteAlpha.800"}
        _hover={{ color: 'white' }}
        />
      <Flex 
      justify="center"
      >
        <ColorModeSwitcher />
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={
              <Box 
              w={5} 
              h={4}
              >
                <Box
                  w="80%"
                  h="1.5px"
                  bg="currentColor"
                  mb="5px"
                  mt="4px"
                  borderRadius={"20px"}
                />
                <Box
                  w="80%"
                  h="1.5px"
                  bg="currentColor"
                  borderRadius={"20px"}
                />
              </Box>
            }
            size="lg"
            variant="link"
            color={"whiteAlpha.700"}
            _hover={{ color: 'white' }}
          />
          <MenuList marginTop='12px'
          >
            <MenuItem>
              Home
            </MenuItem>
            <MenuItem>
              Documentation
            </MenuItem>
            <MenuItem>
              Contact
            </MenuItem>
            <MenuItem>
              Report
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      
    </Flex>
    
        

    {/*TRAPEZOID*/}
    <Box
        w="100px"
        h="20px"
        as='button'
        transform={isCollapsed ? 'translateY(200%)' : 'translateY(480%)'}
        transition="0.4s ease"
        onMouseEnter={handleMouseLeave}
        onMouseLeave={handleMouseEnter}
        position="fixed"
        borderTopWidth="14px"
        borderTopColor="#3f67ff"
        borderBottomWidth="0px"
        borderBottomColor="#3f67ff"
        borderLeftWidth="1px"
        borderRightWidth="1px"
        borderLeftColor="transparent"
        borderRightColor="transparent"
        borderBottomRadius="15px"
        zIndex={991}
      >
        <IconButton
        icon={isCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
        aria-label={isCollapsed ? 'Expand' : 'Collapse'}
        onClick={handleCollapse}
        position="absolute"
        variant={"link"}
        left="50%"
        bottom="1"
        overflow="hidden"
        transform="translateX(-50%)"
        color={"whiteAlpha.700"}
        _hover={{ color: 'white' }}
        size={"lg"}
      />
      </Box>
      <Box
      as='button'
      position="fixed"
      w={"100%"}
      top={10}
      zIndex={992}
      bgColor={"#3f67ff"}
      overflow="hidden"
      minHeight={isCollapsed ? '2px' : '100px'}
      maxHeight={isCollapsed ? '2px' : '100px'}
      onMouseEnter={handleMouseLeave}
      onMouseLeave={handleMouseEnter}
      transition="0.5s ease"
      >
      {!isCollapsed && <ConnectComponent/>}
      </Box>
    </VStack>
    
  );
};

export default Navbar;
