//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract Test {
    bytes32 public DOMAIN_SEPARATOR;
    string constant public domainName = "SuperKluster";
    string constant public version = "1";

    mapping (address => uint256) public nonces;

    bytes32 constant public SK_TYPEHASH = keccak256("SuperKlusterItem(address collection,address addr1,address addr2,uint256 tokenId,uint256 quantity,uint256 price,string tokenURI,uint256 nonce,uint256 deadline)");      

    address private signer;

    uint256 public verifyCount = 0;

    constructor(address _signer) {
        signer = _signer;

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'),
                keccak256(bytes(domainName)),
                keccak256(bytes(version)),
                block.chainid,
                0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC
            )       
        );       
    }

    function testVerify(
        address _collection,
        uint256 _tokenId,
        uint256 _supply,
        string memory _tokenURI,
        uint256 deadline,
        uint8 v, bytes32 r, bytes32 s
    ) external {
        require(block.timestamp <= deadline, "Test: Invalid expiration in testVerify");

        uint256 currentValidNonce = nonces[msg.sender];

        bytes32 digest = keccak256(
            abi.encodePacked(
                '\x19\x01',
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(SK_TYPEHASH, _collection, msg.sender, msg.sender, _tokenId, _supply, 0, _tokenURI, currentValidNonce, deadline))
            )
        );

        require(signer == ecrecover(digest, v, r, s), "Test: Invalid Signature in testVerify");

        nonces[msg.sender] = currentValidNonce + 1;

        verifyCount = verifyCount + 1;
    }
}