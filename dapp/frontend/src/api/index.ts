import { AptosClient, Types } from "aptos";
import { MODULE_ADDRESS, PROVIDER } from '../constants';
//import { NetworkName } from "../constants";
import '../types';

/// Get a Token's address
export async function getTokenAddress(
    token: Token,
    nodeUrl: string,
): Promise<any> {
    const client = new AptosClient(nodeUrl); 
    const payload: Types.ViewRequest = {
        function: `${MODULE_ADDRESS}::property::view_fractional_share_token_address`,
        type_arguments: [],
        arguments: [token],
      }; 
      const response = await client.view(payload);
      return response[0] as any;    
}