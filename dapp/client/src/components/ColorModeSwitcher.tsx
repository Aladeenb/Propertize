import * as React from "react"
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps
} from "@chakra-ui/react"
import { MoonIcon } from '@chakra-ui/icons';
import { BsSunFill } from 'react-icons/bs';

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const { toggleColorMode } = useColorMode()
  const text = useColorModeValue("dark", "light")
  const SwitchIcon = useColorModeValue(BsSunFill, MoonIcon)

  return (
    <IconButton
      size="md"
      fontSize="md"
      variant="link"
      color={"whiteAlpha.700"}
      _hover={{ color: 'white' }}
      marginLeft="2"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  )
}
