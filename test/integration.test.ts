import { sdk } from "./sdk";

describe("NFT Rewards", () => {

  it("mints NFT when funding new project", async () => {

    const projectId = 123;

    await sdk.drips.setStreams({
      newReceivers: [{
        accountId: projectId,
        // ...config  
      }]
    });

    expect(await sdk.nftReward.ownerOf(projectId)).to.equal(funder);

  });

  it("burns NFT when defunding project", async () => {

    // Fund project
    await sdk.drips.setStreams({/*...*/});

    // Then remove project from receivers
    await sdk.drips.setStreams({
      currReceivers: [], 
      newReceivers: [] 
    });

    expect(await sdk.nftReward.ownerOf(projectId)).to.be.reverted;

  });

  // Imports

describe("NFT integration", async () => {

    let drips: DripsSDK;
    let nft: NFT;
    let registry: NFTRegistry;
  
    beforeEach(async () => {
      // Deploy contracts
      drips = new DripsSDK(); 
      nft = await deployNFTContract();
      registry = await deployNFTRegistryContract();
  
      // Connect contracts
      await connectContracts(drips, nft, registry); 
    });
  
    it("mints NFT when funding starts", async () => {
      const projectId = 1;
  
      await drips.startFundingStream(projectId, 1000);
  
      const tokenId = getNftIdForProject(projectId);
  
      expect(await nft.ownerOf(tokenId)).to.equal(funder); 
      expect(await registry.nfts(tokenId)).to.exist; 
    });
  
    it("transfers NFT when funding owner changes", async () => {
      // Setup initial funding stream
      await drips.startFundingStream(projectId, 1000);
  
      // Transfer stream
      await drips.transferFundingStream(projectId, newFunder);
      
      const tokenId = getNftIdForProject(projectId);
  
      expect(await nft.ownerOf(tokenId)).to.equal(newFunder);
    });
  
    // Other test cases...
  
  });

});