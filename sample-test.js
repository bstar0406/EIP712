const { expect } = require("chai");
const { ethers } = require("hardhat");

let test;

let SK_DOMAIN = {
  name: 'SuperKluster',
  version: '1',
  chainId: 31337,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
};

let SK_TYPES = {
  SuperKlusterItem: [
    {name: "collection", type: "address"}, 
    {name: "addr1", type: "address"}, 
    {name: "addr2", type: "address"},
    {name: "tokenId", type: "uint256"},
    {name: "quantity", type: "uint256"},
    {name: "price", type: "uint256"},
    {name: "tokenURI", type: "string"},
    {name: "nonce", type: "uint256"},
    {name: "deadline", type: "uint256"}
  ]
};

describe("SK Tests", function() {
  this.beforeEach(async function() {
    [account1, account2, account3, account4] = await ethers.getSigners();

    const TEST = await ethers.getContractFactory("Test");

    test = await TEST.deploy(account1.address);
    await test.deployed();

    console.log("Marketplace Address: ", test.address);
  })

  it("UseCase105 Test", async function() {
    [ 
      account1, // admin key
      account2
    ] = await ethers.getSigners();

    let addItem = {
      collection: "0xc9db3b61eb85834cb5064d52e5cd1dca35c71b1c",
      tokenId: 1123,
      supply: 1,
      tokenURI: "https://base_uri/url/back.json",
      deadline: 1664582399,
      nonce: 0,
    };

      const value = {
        collection: addItem.collection,
        addr1: account2.address,
        addr2: account2.address,
        tokenId: addItem.tokenId,
        quantity: addItem.supply,
        price: 0,
        tokenURI: addItem.tokenURI,
        nonce: addItem.nonce,
        deadline: addItem.deadline        
      };
      let signature = await account1._signTypedData(SK_DOMAIN, SK_TYPES, value);
      const { r, s, v } = ethers.utils.splitSignature(signature);
      await test.connect(account2).testVerify(
        addItem.collection,
        addItem.tokenId,
        addItem.supply,
        addItem.tokenURI,
        addItem.deadline,
        v, r, s
      );
  })
});