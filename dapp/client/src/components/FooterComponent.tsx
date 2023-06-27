import { Box, Flex, Link, Text, Icon, IconButton, VStack } from '@chakra-ui/react';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';
import  logo  from '../pictures/logo192.png';

export const Footer = () => {
  return (
    <Box 
        py={10} 
        w={"100%"}
        bgColor={"blackAlpha.200"}
    >
        <VStack>
            <IconButton 
            aria-label={'Logo'}
            icon={<img src={logo} alt="Logo" style={{ width: '50px', height: 'auto' }}/>}
            size="md"
            variant={"link"}
            color={"primary.700"}
            _hover={{ color: 'white' }}
            />
            <Text 
                fontSize="xs"
            >© 2023 Propertize</Text>
            <Box h={"30px"}></Box>
            <Text as={"button"} _hover={{ color: '#79fee0' }}> Whitepaper ↗ </Text>
            <Text as={"button"} _hover={{ color: '#79fee0' }}> About us </Text>
            <Text as={"button"} _hover={{ color: '#79fee0' }}> Terms </Text>
            <Box h={"30px"}></Box>
        </VStack>
      <Flex
        align="center"
        justify="center"
        px={8}
      >
        <Flex align="center">
          <Link href="https://github.com/Aladeenb/Propertize" mx={2} isExternal>
            <Icon as={FiGithub} boxSize={6} 
            _hover={{ color: '#79fee0' }}
            />
          </Link>
          <Link href="https://twitter.com" mx={2} isExternal>
            <Icon as={FiTwitter} boxSize={6} 
            _hover={{ color: '#79fee0' }}
            />
          </Link>
          <Link href="https://linkedin.com" mx={2} isExternal>
            <Icon as={FiLinkedin} boxSize={6}
          _hover={{ color: '#79fee0' }}
          />
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};
