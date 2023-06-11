import { Provider, Network, AptosClient, FaucetClient, TokenClient } from "aptos";

export const PROVIDER = new Provider(Network.DEVNET);

export const MODULE_ADDRESS = "0x438f261f7d74f1b04d3558165b0c91df8caa623f5adb8e3dc6427f8c145fbbbb";
export const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
export const FAUCET_URL = process.env.APTOS_FAUCET_URL || "https://faucet.devnet.aptoslabs.com";

export const client = new AptosClient(NODE_URL);
export const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL); 
export const tokenClient = new TokenClient(client); 
