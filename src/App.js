import { useState, useEffect } from "react";
import { ethers } from "ethers";
import NawatAlHikmaNFTABI from "./NawatAlHikmaNFTABI.json";

const contractAddress = "0xYourContractAddressHere"; // استبدل بعنوان عقدك

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [currentTokenId, setCurrentTokenId] = useState(0);
  const [minting, setMinting] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);
      prov.send("eth_requestAccounts", []).then((accounts) => setAccount(accounts[0]));
      const cont = new ethers.Contract(contractAddress, NawatAlHikmaNFTABI, prov.getSigner());
      setContract(cont);
    }
  }, []);

  useEffect(() => {
    if (contract) {
      contract.revealed().then(setRevealed);
      contract.currentTokenId().then((id) => setCurrentTokenId(id.toNumber()));
    }
  }, [contract]);

  async function mintNFT() {
    if (!contract) return;
    try {
      setMinting(true);
      // تعديل قيمة الرسوم حسب عقدك (مثلاً 0.01 ETH)
      const tx = await contract.emerge({ value: ethers.utils.parseEther("0.01") });
      await tx.wait();
      alert("NFT minted successfully!");
      const id = await contract.currentTokenId();
      setCurrentTokenId(id.toNumber());
    } catch (err) {
      alert("Error: " + (err.data?.message || err.message));
    } finally {
      setMinting(false);
    }
  }

  async function revealNFTs() {
    if (!contract) return;
    try {
      const tx = await contract.illuminate();
      await tx.wait();
      setRevealed(true);
      alert("NFTs revealed!");
    } catch (err) {
      alert("Error: " + (err.data?.message || err.message));
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Nawat Al Hikma NFT</h1>
      <p><b>Account:</b> {account || "Not connected"}</p>
      <p><b>Minted NFTs:</b> {currentTokenId}</p>
      <p><b>Revealed:</b> {revealed ? "Yes" : "No"}</p>

      <button onClick={mintNFT} disabled={minting}>
        {minting ? "Minting..." : "Mint NFT"}
      </button>

      <button onClick={revealNFTs} style={{ marginLeft: "10px" }}>
        Reveal NFTs (Guardians only)
      </button>
    </div>
  );
}

export default App;
