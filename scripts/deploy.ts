import { ethers, network } from 'hardhat';
import { NTF} from '../contracts/NFT.sol';
import {NFTRegistry } from '../contracts/NFTRegistry.sol';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with account:', deployer.address);

  const NTFContract = await ethers.getContractFactory('NTF');
  const ntf = await NTFContract.deploy();

  const NFTRegistryContract = await ethers.getContractFactory('NFTRegistry');
  const nftRegistry = await NFTRegistryContract.deploy(ntf.address);

  console.log('Contracts deployed:');
  console.log('NTF:', ntf.address);
  console.log('NFTRegistry:', nftRegistry.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
