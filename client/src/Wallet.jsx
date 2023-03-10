import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value; // gets the private key you entered
    setPrivateKey(privateKey); // sets the Private Key in the state
    const address = toHex(secp.getPublicKey(privateKey)); // derives the Public Key from your Private Key
    setAddress(address); // sets your address/Public Key in the state

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`); // gets balance from server based on your address
      setBalance(balance); // sets the balance in the state
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Enter your private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div className="address">
        Address: {address}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
