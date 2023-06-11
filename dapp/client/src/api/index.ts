import { AptosClient, Types } from "aptos";
import { MODULE_ADDRESS, PROVIDER } from "../constants";

type token = {
    property: string,
    name: string,
    description: string,
    uri: string
}

export async function getFractionalTokenAddress(
    FractionalToken: token,
): Promise<any> {
    const payload: Types.ViewRequest = {
      function: `${MODULE_ADDRESS}::property::view_fractional_share_token_address`,
      type_arguments: [],
      arguments: [
        FractionalToken
      ],
    };
    const response = await PROVIDER.view(payload);
    return response[0] as any;
  }