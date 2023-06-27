import React from "react";
import { Box, Flex, VStack} from "@chakra-ui/react";

interface LayoutProps {
  children: React.ReactNode;
  color: string;
}

export default function SectionLayout({ color, children , ...rest}: LayoutProps) {

  return (
    <Flex
      h={"600px"}
      w={"100%"}
      bgColor={color}
    >
        <Box flex="1"  {...rest}>
        {children}
        </Box>
        
    </Flex>
    
    
  );
}