import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/9f9cafc2197a4937a095fdac3dfde7cb", 
      accounts: ["ba66bec5b39dfe10667a3034604880b7e949c943c5a00b2cd665f87e2df4e954"], 
    },
  },
};

export default config;
