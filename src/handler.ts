import { DripsSDK } from "radicle-drips";
import { ethers } from "ethers";

const sdk = new DripsSDK();
const nft = sdk.nft; 
const registry = sdk.nftRegistry;

// Mapping of authorized addresses
mapping(address => bool) public authorized; 

// Set authorized addresses
function authorize(address user) external onlyOwner {
  authorized[user] = true;
}

// Revoke authorization 
function unauthorize(address user) external onlyOwner {
  authorized[user] = false;
}

// Modifier to restrict access 
modifier onlyAuthorized() {
  require(authorized[msg.sender], "Not authorized");
  _;
}

async function handleNewFunder(event) {
  // Authorized check
  require(authorized[msg.sender], "Not authorized");
  // Generate unique NFT id
  const tokenId = ethers.utils.keccak256(event.funder, event.blockNumber);
  
  // Mint generic NFT
  await nft.mint(event.funder, tokenId, GENERIC_URI);

  // Register in registry
  await registry.registerNFT(tokenId, event.funder, GENERIC_URI);
}

async function handleFundingStarted(event) {
  // Mint project NFT if first time funded
  if (!isProjectFunded(event.projectId)) {
    const tokenId = getNftIdForProject(event.projectId);
    const uri = await getProjectMetadata(event.projectId);
    await nft.mint(event.funder, tokenId, uri);
    await registry.registerNFT(tokenId, event.funder, uri);
  }

  // Otherwise, transfer existing NFT 
  else {
    const tokenId = getNftIdForProject(event.projectId);
    await nft.transferFrom(registry.nfts(tokenId).funder, event.funder, tokenId); 
  }
}

async function handleFundingStopped(event) {
  const tokenId = getNftIdForProject(event.projectId);
  
  // Revoke NFT from old funder
  await nft.transferFrom(registry.nfts(tokenId).funder, ZERO_ADDRESS, tokenId);

  // Clear registry
  await registry.unregisterNFT(tokenId);
}

async function handleProjectAdded(event) {
    // Generate unique id
    const tokenId = ethers.utils.keccak256(event.projectId, event.blockNumber);
  
    // Mint NFT with generic metadata
    await nft.mint(event.projectIdOwner, tokenId, GENERIC_URI); 
    
    // Register in registry
    await registry.registerNFT(tokenId, event.projectIdOwner, GENERIC_URI);
}
  
async function handleProjectRemoved(event) {
    // Get tokenId
    const tokenId = getNftIdForProject(event.projectId);

    // Burn NFT 
    await nft.burn(tokenId);

    // Remove from registry
    await registry.unregisterNFT(tokenId);
}
  
async function handleMetadataUpdated(event) {
    // Get tokenId
    const tokenId = getNftIdForProject(event.projectId);

    // Update URI in registry
    await registry.updateNFTUri(tokenId, event.uri); 
}

// Other handlers...

async function getProjectMetadata(projectId) {
    // Allow projects to upload JSON to IPFS, Filecoin etc
    const ipfsHash = projects[projectId].metadataIpfsHash; 
    const json = fetchIpfsJson(ipfsHash);
    return json;
}

function isProjectFunded(projectId) {
    const tokenId = getNftIdForProject(projectId);
    return nft.exists(tokenId);
}


function getNftIdForFunder(address funder) public pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked("FUNDER", funder))); 
}

function getNftIdForProject(uint256 projectId) public pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked("PROJECT", projectId)));
}

function mint(address to, uint256 tokenId, string memory uri) external onlyAuthorized {

    // Check token does not already exist
    require(!_exists(tokenId), "Token already minted");
  
    // Mint token 
    _mint(to, tokenId);
  
    // Set token URI  
    _setTokenURI(tokenId, uri);
  
}

function burn(uint256 tokenId) external onlyAuthorized {

    // Validate owner
    require(_isApprovedOrOwner(msg.sender, tokenId), "Not authorized");  
  
    _burn(tokenId);
  
}

async function getFunderForProject(uint256 projectId) {

    // Get NFT id
    const tokenId = getNftIdForProject(projectId);
  
    // Lookup in registry
    const nft = await registry.nfts(tokenId);
    
    return nft.funder;
  
}

// Listen for events

sdk.drips.on("NewFunder", handleNewFunder);

sdk.drips.on("FundingStarted", handleFundingStarted);

sdk.drips.on("FundingStopped", handleFundingStopped);

sdk.drips.on("ProjectAdded", handleProjectAdded);

sdk.drips.on("ProjectRemoved", handleProjectRemoved); 

sdk.drips.on("MetadataUpdated", handleMetadataUpdated);