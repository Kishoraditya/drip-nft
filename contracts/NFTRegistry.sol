// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTRegistry {

  struct NFT {
    address funder;
    string uri; 
  }

  mapping(uint256 => NFT) public nfts;

  event NFTRegistered(uint256 indexed nftId, address indexed funder, string uri);
  event NFTUriUpdated(uint256 indexed nftId, string uri);

  function registerNFT(uint256 nftId, address funder, string calldata uri) external {
    nfts[nftId] = NFT(funder, uri);
    emit NFTRegistered(nftId, funder, uri);
  }

  function updateNFTUri(uint256 nftId, string calldata uri) external {
    NFT storage nft = nfts[nftId];
    nft.uri = uri;
    emit NFTUriUpdated(nftId, uri);
  }

}