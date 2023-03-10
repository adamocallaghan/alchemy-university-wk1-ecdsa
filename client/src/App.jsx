import Wallet from "./Wallet";
import Transfer from "./Transfer";
import SignAndTransfer from "./SignAndTransfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        address={address}
        setAddress={setAddress}
      />
      <SignAndTransfer
        setBalance={setBalance}
        address={address}
        setPrivateKey={setPrivateKey} />
    </div>
  );
}

export default App;
