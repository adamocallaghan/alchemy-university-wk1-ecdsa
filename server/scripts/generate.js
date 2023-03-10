const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

// Generate Private Key
const privateKey = secp.utils.randomPrivateKey();
console.log("private key: ", toHex(privateKey));

// Generate Public Key
const publicKey = secp.getPublicKey(privateKey);
console.log("public key: ", toHex(publicKey));

// Generate Public Key using Keccak256 (like an Ethereum address)
const publicKeyK256 = keccak256((publicKey.slice(1)).slice(-20));
console.log("public key (keccak256): ", toHex(publicKeyK256));