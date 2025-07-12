// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NawatAlHikmaNFT is ERC721Burnable, Ownable {
    uint256 public heritageLimit = 500;
    uint256 public currentTokenId = 0;
    bool public revealed = false;

    bool public marketingFeeEnabled = false;
    uint256 public marketingFee = 0.01 ether;
    address payable public marketingWallet;

    mapping(address => bool) public guardians;
    mapping(address => bool) public allowedMinters;

    string private baseURI_hidden;
    string private baseURI_revealed;

    constructor(string memory _hiddenURI, address payable _marketingWallet) ERC721("NawatAlHikmaNFT", "NAH") {
        guardians[msg.sender] = true;
        baseURI_hidden = _hiddenURI;
        marketingWallet = _marketingWallet;
    }

    modifier onlyGuardian() {
        require(guardians[msg.sender], "Not a guardian");
        _;
    }

    modifier onlyAllowedMinter() {
        require(allowedMinters[msg.sender], "Not allowed to mint");
        _;
    }

    function addGuardian(address _guardian) public onlyOwner {
        guardians[_guardian] = true;
    }

    function removeGuardian(address _guardian) public onlyOwner {
        guardians[_guardian] = false;
    }

    function addAllowedMinter(address _minter) public onlyOwner {
        allowedMinters[_minter] = true;
    }

    function removeAllowedMinter(address _minter) public onlyOwner {
        allowedMinters[_minter] = false;
    }

    function setMarketingFeeEnabled(bool _enabled) public onlyGuardian {
        marketingFeeEnabled = _enabled;
    }

    function setMarketingFee(uint256 _fee) public onlyGuardian {
        marketingFee = _fee;
    }

    function setMarketingWallet(address payable _wallet) public onlyGuardian {
        marketingWallet = _wallet;
    }

    function emerge() public payable onlyAllowedMinter {
        require(currentTokenId < heritageLimit, "All NFTs minted");

        if (marketingFeeEnabled) {
            require(msg.value >= marketingFee, "Insufficient marketing fee");
            marketingWallet.transfer(msg.value);
        } else {
            require(msg.value == 0, "No fee required");
        }

        currentTokenId++;
        _safeMint(msg.sender, currentTokenId);
    }

    function batchEmerge(address to, uint256 amount) public onlyOwner {
        require(currentTokenId + amount <= heritageLimit, "Exceeds limit");
        for (uint256 i = 0; i < amount; i++) {
            currentTokenId++;
            _safeMint(to, currentTokenId);
        }
    }

    function illuminate() public onlyGuardian {
        revealed = true;
    }

    function setBaseURIRevealed(string memory _revealedURI) public onlyGuardian {
        baseURI_revealed = _revealedURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");

        if (!revealed) {
            return baseURI_hidden;
        } else {
            return string(abi.encodePacked(baseURI_revealed, _toString(tokenId), ".json"));
        }
    }

    uint256 public minWithdrawalAmount = 1 ether;

    function withdraw() public onlyOwner {
        require(address(this).balance >= minWithdrawalAmount, "Balance too low");
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
    fallback() external payable {}
}
