import { ChakraProvider, theme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes";


export const App = () => (
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </ChakraProvider>
);