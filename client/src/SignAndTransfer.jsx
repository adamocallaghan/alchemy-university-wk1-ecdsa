import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
// import { secp } from "ethereum-cryptography/secp256k1";
import * as secp from "@noble/secp256k1";

function SignAndTransfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [signature, setSignature] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    // Hash function
    function hashMessage(message) {
      const bytes = utf8ToBytes(message);
      const hash = toHex(keccak256(bytes));
      console.log("Message Hash: ", hash);
      return hash;
    }
    // Hash message - message is composed of sender, recipient and amount
    const msgHash = hashMessage(address + recipient + parseInt(sendAmount));

    // Sign function
    async function signMessage(msgHash, privateKey) {
      const signature = await secp.sign(msgHash, privateKey, { recovered: true });
      console.log("Signature: ", signature)
      return signature;
    }

    // Sign message with private key and get signature and recovery bit
    const [sig, recoveryBit] = await signMessage(msgHash, privateKey);
    console.log("Sig: ", sig);
    console.log("Recovery Bit: ", recoveryBit);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, { // send it all over to the server
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        sig,
        recoveryBit,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Private Key
        <input
          placeholder="Enter your Private Key"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>

      <label>
        Signature
        <input
          placeholder="Enter your Signature"
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default SignAndTransfer;
