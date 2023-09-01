import { DripsSDK } from "drips-sdk";

const sdk = new DripsSDK({
  // Point to our contracts
  contracts: {
    nftReward: "0x...",
  } 
});