// src/components/ProfileView.tsx
import { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaCreditCard,
  FaImage,
  FaExchangeAlt,
} from "react-icons/fa";

import {
  useCurrentAccount,
  useSuiClient,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
// import CryptoJS from "crypto-js";
import { supabase } from "../utils/supabaseClient";
import Header from "./Header";
import OfframpModal from "./OfframpModal";
import InstantNftSaleModal from "./InstantNftSaleModal";

// const ENCRYPTION_SECRET = import.meta.env.VITE_ENCRYPTION_SECRET as string;

const ProfileView = () => {
  const name = "..";
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const walletAddress = currentAccount?.address ?? "Not connected";
  const [suiBalance, setSuiBalance] = useState<number | null>(null);
  const [cardExists, setCardExists] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [coinId, setCoinId] = useState("");
  const [coins, setCoins] = useState<
    { coinObjectId: string; balance: string }[]
  >([]);
  const [transferType, setTransferType] = useState<"specific" | "all">(
    "specific"
  );
  const [transferStatus, setTransferStatus] = useState<string | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOfframpOpen, setIsOfframpOpen] = useState(false);
  const [isInstantNftSaleOpen, setIsInstantNftSaleOpen] = useState(false);

  // Your deployed package ID
  const PACKAGE_ID =
    "0x729672976c11e65bec2a0dc10b45d6cca6df9c3c78827622ff338e10742b7284";

  useEffect(() => {
    const fetchBalanceAndCard = async () => {
      if (!currentAccount?.address) {
        setSuiBalance(null);
        setCoins([]);
        setCoinId("");
        return;
      }

      // Fetch SUI balance and coins
      try {
        const coinData = await suiClient.getCoins({
          owner: currentAccount.address,
          coinType: "0x2::sui::SUI",
        });
        const total = coinData.data.reduce(
          (sum, coin) => sum + Number(coin.balance),
          0
        );
        setSuiBalance(total / 1_000_000_000);
        setCoins(
          coinData.data.map((coin) => ({
            coinObjectId: coin.coinObjectId,
            balance: (Number(coin.balance) / 1_000_000_000).toFixed(3),
          }))
        );
      } catch (err: any) {
        setFeedback(`❌ Error fetching coins: ${err.message}`);
      }

      // Fetch card details from Supabase
      const { data } = await supabase
        .from("virtual_cards")
        .select("*")
        .eq("wallet_address", currentAccount.address)
        .single();

      if (data) {
        setCardExists(true);
        // setCardData(data); // Removed as per edit hint
      } else {
        setCardExists(false);
        // setCardData(null); // Removed as per edit hint
      }
    };
    fetchBalanceAndCard();
  }, [currentAccount, suiClient]);

  // Generate random card details
  const generateCardDetails = () => {
    const cardNumber = Array(4)
      .fill(0)
      .map(() => Math.floor(1000 + Math.random() * 9000))
      .join(" ");
    const expiryMonth = String(Math.floor(Math.random() * 12) + 1).padStart(
      2,
      "0"
    );
    const expiryYear = String(
      new Date().getFullYear() + Math.floor(Math.random() * 5) + 1
    ).slice(-2);
    const cvv = String(Math.floor(100 + Math.random() * 900));
    const cardHolder = walletAddress;

    return {
      cardNumber,
      expiry: `${expiryMonth}/${expiryYear}`,
      cvv,
      cardHolder,
    };
  };

  // Encrypt card details
  const encryptCardDetails = (details: object) => {
    const jsonString = JSON.stringify(details);
    return btoa(jsonString); // Simple base64 encoding for demo
  };

  // const decryptCardDetails = (ciphertext: string) => {
  //   try {
  //     const jsonString = atob(ciphertext);
  //     return JSON.parse(jsonString);
  //   } catch (e) {
  //     return null;
  //   }
  // };

  // Handle virtual card generation
  const handleGetVirtualCard = async () => {
    console.log("Generating virtual card...");
    setFeedback(null);
    const cardDetails = generateCardDetails();
    const encrypted = encryptCardDetails(cardDetails);

    if (walletAddress !== "Not connected" && suiBalance !== null) {
      const { error, data } = await supabase.from("virtual_cards").insert([
        {
          wallet_address: walletAddress,
          encrypted_card: encrypted,
          sui_balance: suiBalance,
        },
      ]);
      if (error) {
        setFeedback(`❌ Failed to store card: ${error.message}`);
        console.error("Supabase insert error:", error);
      } else {
        setFeedback("✅ Card stored in Supabase!");
        setCardExists(true);
        // setCardData({ // Removed as per edit hint
        //   wallet_address: walletAddress,
        //   encrypted_card: encrypted,
        //   sui_balance: suiBalance,
        // });
        console.log("Supabase insert response:", data);
      }
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount) {
      setTransferError("Please connect your wallet first.");
      return;
    }
    if (!coinId || !recipient || (transferType === "specific" && !amount)) {
      setTransferError("Please fill in all required fields.");
      return;
    }
    setTransferStatus(null);
    setTransferError(null);
    setLoading(true);

    try {
      // Validate coin balance for specific transfer
      if (transferType === "specific") {
        const amountInSui = parseFloat(amount);
        if (amountInSui <= 0) {
          throw new Error("Amount must be greater than 0.");
        }
        // Fetch coin details to validate balance
        const coinData = await suiClient.getObject({
          id: coinId,
          options: { showContent: true },
        });
        const balance =
          Number((coinData.data?.content as any)?.fields?.balance || 0) /
          1_000_000_000;
        if (balance < amountInSui) {
          throw new Error("Insufficient coin balance for transfer.");
        }
      }

      const txb = new Transaction();
      if (transferType === "specific") {
        const amountInMist = Math.floor(parseFloat(amount) * 1_000_000_000);
        // Split coin for the exact transfer amount
        const [transferCoin] = txb.splitCoins(txb.object(coinId), [
          txb.pure.u64(amountInMist),
        ]);
        // Call transfer_sui with the split coin
        txb.moveCall({
          target: `${PACKAGE_ID}::transfer::transfer_sui`,
          arguments: [
            transferCoin,
            txb.pure.u64(amountInMist),
            txb.pure.address(recipient),
          ],
        });
        // Transfer the original coin (remainder) back to sender
        txb.transferObjects(
          [txb.object(coinId)],
          txb.pure.address(currentAccount.address)
        );
      } else {
        // For transfer_all, use the entire coin
        txb.moveCall({
          target: `${PACKAGE_ID}::transfer::transfer_all`,
          arguments: [txb.object(coinId), txb.pure.address(recipient)],
        });
      }

      await signAndExecuteTransaction(
        {
          transaction: txb as any,
          chain: "sui:testnet",
        },
        {
          onSuccess: (result) => {
            setTransferStatus(
              `Transaction successful! Digest: ${result.digest}`
            );
            // Refresh coins (not updating UI balance as per original UI)
            suiClient
              .getCoins({
                owner: currentAccount.address,
                coinType: "0x2::sui::SUI",
              })
              .then((coinData) => {
                setCoins(
                  coinData.data.map((coin) => ({
                    coinObjectId: coin.coinObjectId,
                    balance: (Number(coin.balance) / 1_000_000_000).toFixed(3),
                  }))
                );
              });
          },
          onError: (err) => {
            throw new Error(`Transaction failed: ${err.message}`);
          },
        }
      );
    } catch (err: any) {
      setTransferError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Optionally, show decrypted card details
  // let decryptedCard = null;
  // if (cardExists && cardData?.encrypted_card) {
  //   try {
  //     decryptedCard = decryptCardDetails(cardData.encrypted_card);
  //   } catch (e) {
  //     decryptedCard = null;
  //   }
  // }

  useEffect(() => {
    function handlePaystackMessage(event: MessageEvent) {
      if (
        event.origin === window.location.origin &&
        event.data &&
        event.data.paystackSuccess
      ) {
        alert("Payment successful!"); // Or show a custom success UI
        // Optionally, refresh data here
      }
    }
    window.addEventListener("message", handlePaystackMessage);
    return () => window.removeEventListener("message", handlePaystackMessage);
  }, []);

  return (
    <div className="p-6">
      <div className="min-h-screen bg-black text-white md:px-6 lg:px-30 py-6 font-sans">
        {/* Header */}
        <Header name={name} walletAddress={walletAddress} />

        {/* Profile Info */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          {/* Feedback message */}
          {feedback && (
            <div
              className={`mb-4 px-4 py-2 rounded ${
                feedback.startsWith("✅")
                  ? "bg-green-800 text-green-200"
                  : "bg-red-800 text-red-200"
              }`}
            >
              {feedback}
            </div>
          )}

          <div className="">
            <div className="flex justify-between">
              <h3 className="text-md font-medium mb-2">Profile Overview</h3>
              <section className="mb-2 flex justify-between items-center">
                {!cardExists && (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                    onClick={handleGetVirtualCard}
                  >
                    <FaCreditCard />
                    Get Virtual Card
                  </button>
                )}
              </section>
            </div>
            <p className="text-sm text-gray-400 mb-4 border-t border-gray-700 pt-4">
              Manage your Web3 Payment Card Account
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {/* Account Status */}
              <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center gap-2">
                <p className="text-lg">Account Status</p>
                <FaCheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-500 font-bold flex items-center gap-1">
                  VERIFIED
                </p>
              </div>

              {/* Total Balance */}
              <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center gap-2">
                <p className="text-lg ">$ SUI Balance</p>
                <p className="text-xl font-bold">100</p>
                <p className="text-md text-green-400">$2,35</p>
              </div>

              {/* Monthly Spending */}
              <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center gap-2">
                <p className="text-lg">Total Spent</p>
                <p className="text-xl font-bold">50.38</p>
                <p className="text-md text-green-400">$1,15</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div>
          <h3 className="text-md font-medium mb-3">Quick Action</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-900 rounded-xl p-6 mb-8">
            {/* Fund Card */}
            <button
              className="bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="flex flex-col items-center gap-2 mb-2">
                <FaCreditCard className="text-green-600 text-xl" />
                <p className="text-lg font-semibold">Transfer Sui</p>
                <p className="text-sm text-gray-400">Send $SUI to an address</p>
              </div>
            </button>
            <button
              className="bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700"
              onClick={() => setIsOfframpOpen(true)}
            >
              <div className="flex flex-col items-center gap-2 mb-2">
                <FaExchangeAlt className="text-green-600 text-xl" />
                <p className="text-lg font-semibold">Offramp</p>
                <p className="text-sm text-gray-400">Send $SUI, Get fiat</p>
              </div>
            </button>

            <OfframpModal
              open={isOfframpOpen}
              onClose={() => setIsOfframpOpen(false)}
            />

            {/* Instant NFT Sale Button */}
            <button
              className="bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700 mt-4"
              onClick={() => setIsInstantNftSaleOpen(true)}
            >
              <div className="flex flex-col items-center gap-2 mb-2">
                <FaImage className="text-purple-600 text-xl" />
                <p className="text-lg font-semibold">Instant NFT Sale</p>
                <p className="text-sm text-gray-400">
                  Sell NFT for instant payout
                </p>
              </div>
            </button>

            <InstantNftSaleModal
              open={isInstantNftSaleOpen}
              onClose={() => setIsInstantNftSaleOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Transfer SUI</h2>
            <form onSubmit={handleTransfer}>
              <div className="mb-4">
                <label className="block text-sm mb-1">Transfer Type</label>
                <select
                  value={transferType}
                  onChange={(e) =>
                    setTransferType(e.target.value as "specific" | "all")
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white"
                >
                  <option value="specific">Specific Amount</option>
                  <option value="all">All SUI</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">Coin Object ID</label>
                {coins.length > 0 ? (
                  <select
                    value={coinId}
                    onChange={(e) => setCoinId(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  >
                    <option value="" disabled>
                      Select a coin
                    </option>
                    {coins.map((coin) => (
                      <option key={coin.coinObjectId} value={coin.coinObjectId}>
                        {coin.coinObjectId} (Balance: {coin.balance} SUI)
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={coinId}
                    onChange={(e) => setCoinId(e.target.value)}
                    placeholder="0x..."
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                    disabled={!currentAccount}
                  />
                )}
              </div>
              {transferType === "specific" && (
                <div className="mb-4">
                  <label className="block text-sm mb-1">Amount (SUI)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount in SUI"
                    step="0.001"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                    disabled={!currentAccount}
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm mb-1">Recipient Address</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                  disabled={!currentAccount}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                  disabled={loading || !currentAccount}
                >
                  {loading ? "Processing..." : "Transfer"}
                </button>
              </div>
              {transferStatus && (
                <p className="mt-4 text-green-400">{transferStatus}</p>
              )}
              {transferError && (
                <p className="mt-4 text-red-400">{transferError}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
