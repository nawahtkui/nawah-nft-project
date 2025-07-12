import { useState, useEffect } from "react";
import { ethers } from "ethers";
import NawatAlHikmaNFTABI from "./NawatAlHikmaNFTABI.json";

const contractAddress = "0xYourContractAddressHere"; // ← غيّر هذا لعنوان عقدك الحقيقي

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
      const tx = await contract.emerge({ value: ethers.utils.parseEther("0.01") }); // ← عدل القيمة حسب عقدك
      await tx.wait();
      alert("✅ NFT تم سكّه بنجاح!");
      const id = await contract.currentTokenId();
      setCurrentTokenId(id.toNumber());
    } catch (err) {
      alert("❌ حدث خطأ: " + (err.data?.message || err.message));
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
      alert("🎉 تم الكشف عن NFTs!");
    } catch (err) {
      alert("❌ خطأ: " + (err.data?.message || err.message));
    }
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🌟 Nawat Al Hikma NFT</h1>
      <p><b>محفظتك:</b> {account || "غير متصلة"}</p>
      <p><b>عدد NFTs المصكوكة:</b> {currentTokenId}</p>
      <p><b>الحالة:</b> {revealed ? "🚀 مكشوفة" : "🔒 مخفية"}</p>

      <button onClick={mintNFT} disabled={minting}>
        {minting ? "يتم السك..." : "سك NFT"}
      </button>

      <button onClick={revealNFTs} style={{ marginLeft: "10px" }}>
        كشف NFTs (للحراس فقط)
      </button>
    </div>
  );
}

