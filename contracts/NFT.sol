// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

    
contract NFT is ERC721, Ownable {

    using Strings for uint256;
        
        // Optional mapping for token URIs
        mapping (uint256 => string) private _tokenURIs;

        // Base URI
        string private _baseURIextended;


        
  constructor() ERC721("DripsNFT", "DRIP") {}

  function mint(address to, uint256 tokenId, string memory uri) external {
    _mint(to, tokenId);
    _setTokenURI(tokenId, uri);
  }

  function burn(uint256 tokenId) external {
    _burn(tokenId); 
  }

  function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
            require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
            _tokenURIs[tokenId] = _tokenURI;
        }
  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
            require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

            string memory _tokenURI = _tokenURIs[tokenId];
            string memory base = _baseURI();
            
            // If there is no base URI, return the token URI.
            if (bytes(base).length == 0) {
                return _tokenURI;
            }
            // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
            if (bytes(_tokenURI).length > 0) {
                return string(abi.encodePacked(base, _tokenURI));
            }
            // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
            return string(abi.encodePacked(base, tokenId.toString()));
        }
  function _baseURI() internal view virtual override returns (string memory) {
            return _baseURIextended;
        }

}
