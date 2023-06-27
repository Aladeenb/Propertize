import React from "react";
import { Box, Flex, VStack, IconButton, Text} from "@chakra-ui/react";
import { Footer } from "../components/FooterComponent";
import Navbar from "../components/NavBarComponent";



interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {

  return (
    <VStack
    >
      <Navbar/>
      {children}
      <Footer/>
    </VStack>
  );
}