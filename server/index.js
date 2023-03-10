const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = { // public keys...
  "0403ac3d381948e1de1ff3858ec1fb3dfb7a3dc975f1cd8c97c599b2bac2c73670909ee58eb38b171f76f8a5d4f4d3761a1fb383a90a04952a81d7f86e8b89a6ea": 100,
  "041c750c20b1a487a0f5e7966aad06a8f2118fe865bf4045ec37c8362029a9e59dedbce32bbf418f298d381d738838aa77d109402159909079a1a7bd20198ca085": 50,
  "044ca7872c15066cdef978a85dc57f2acc7674041f29f0938a9338f4f8aafa59707cc26e72ec45508e4df13f38d5e732cf62eb87f60dda4ee518f9a8dda8f6eb91": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: Get a signature from the client-side application
  // recover the public address from the signature

  const { sender, recipient, amount, signature, recoveryBit } = req.body;
  console.log("Sender: ", sender);
  console.log("Recipient: ", recipient);
  console.log("Amount: ", amount);
  console.log("Signature: ", signature);
  console.log("Recovery Bit: ", recoveryBit);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  // Hash function
  function hashMessage(message) {
    const bytes = utf8ToBytes(message);
    const hash = toHex(keccak256(bytes));
    console.log(hash);
    return hash;
  }
  // Hash message - message is composed of sender, recipient and amount
  const msgHash = hashMessage(sender + recipient + amount);

  // recover the public key using passed in info
  async function recoverKey(msgHash, signature, recoveryBit) {
    const publicKey = await secp.recoverPublicKey(msgHash, signature, recoveryBit);
    return publicKey;
  }
  
  // get public key
  const publicKey = recoverKey(msgHash, signature, recoveryBit);

  if (toHex(publicKey) === sender) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}


/*

private key:  51b02b4af3744c91167bfc4addeb4043143f326b4056db3c57f7853fb1763cd7
public key:  0403ac3d381948e1de1ff3858ec1fb3dfb7a3dc975f1cd8c97c599b2bac2c73670909ee58eb38b171f76f8a5d4f4d3761a1fb383a90a04952a81d7f86e8b89a6ea
public key (keccak256):  96182148fa0c5018024a5ed9f629330d72ec47db0ebfbacec10d889476bb4f82

private key:  243aabb87a8b9cd3e771646dde70dbf9fc714b6994dd59e87e34d616163545c6
public key:  041c750c20b1a487a0f5e7966aad06a8f2118fe865bf4045ec37c8362029a9e59dedbce32bbf418f298d381d738838aa77d109402159909079a1a7bd20198ca085
public key (keccak256):  e94ebbffd763cf8c9dff249ed4823a9437348604ce801f4155fa11d67b6fac4e

private key:  6fcdad6795f49ba02f62a295b1cbd2812565b4c7a24eeeb5768ae2b2f9c991c3
public key:  044ca7872c15066cdef978a85dc57f2acc7674041f29f0938a9338f4f8aafa59707cc26e72ec45508e4df13f38d5e732cf62eb87f60dda4ee518f9a8dda8f6eb91
public key (keccak256):  8d57610e7162ebfc9f71ad01e332e5c29f12c4ae1e5862cc28ee2caabf449643

*/