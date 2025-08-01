import { useEffect, useState } from "react";
import { FaBolt, FaGlobe, FaShieldAlt, FaCoins } from "react-icons/fa";
import Card from "./Card";
import Header from "./Header";
import {
  useCurrentAccount,
  useSuiClient,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { supabase } from "../utils/supabaseClient";
import CryptoJS from "crypto-js";
import ATMCard from "./ATMCard";
import SuccessAlert from "./SuccessAlert";

const ENCRYPTION_SECRET = import.meta.env.VITE_ENCRYPTION_SECRET as string;
const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID as string;

const CardDetails = () => {
  const name = "..";
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();
  const walletAddress = currentAccount?.address ?? "";

  const [decryptedCard, setDecryptedCard] = useState<any>(null);
  const [cardWalletBalance, setCardWalletBalance] = useState<number>(0);

  // Card management state variables
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [pendingCardAction, setPendingCardAction] = useState<
    "fund" | "withdraw"
  >("fund");
  const [fundAmount, setFundAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Helper to shorten wallet address
  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to fetch card wallet balance
  const fetchCardWalletBalance = async (cardWalletAddress: string) => {
    try {
      const coinData = await suiClient.getCoins({
        owner: cardWalletAddress,
        coinType: "0x2::sui::SUI",
      });
      const total = coinData.data.reduce(
        (sum, coin) => sum + Number(coin.balance),
        0
      );
      setCardWalletBalance(total / 1_000_000_000);
    } catch (err: any) {
      console.error("Error fetching card wallet balance:", err);
      setCardWalletBalance(0);
    }
  };

  // Function to refresh all card data
  const refreshCardData = async () => {
    if (decryptedCard?.address) {
      await fetchCardWalletBalance(decryptedCard.address);
    }
  };

  // Helper function to find the best coin for transfer (highest balance)
  const findBestCoin = async () => {
    if (!currentAccount?.address) return null;

    const coinData = await suiClient.getCoins({
      owner: currentAccount.address,
      coinType: "0x2::sui::SUI",
    });

    if (coinData.data.length === 0) return null;

    return coinData.data.reduce((best: any, current: any) =>
      Number(current.balance) > Number(best.balance) ? current : best
    );
  };

  // Helper function to transfer SUI with fee
  const transferSpecificAmount = async (
    amount: number,
    recipient: string,
    useFee: boolean = false
  ) => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }

    console.log("Transfer details:", {
      amount,
      recipient,
      useFee,
    });

    const amountInMist = BigInt(Math.floor(amount * 1_000_000_000));
    if (amountInMist <= 0) {
      throw new Error("Amount must be greater than 0.");
    }

    const tx = new Transaction();

    if (useFee) {
      // For fee transfers, split from gas coin and use transfer_with_fee
      const [splitCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist)]);

      // Use the transfer_with_fee function on the split coin
      tx.moveCall({
        target: `${PACKAGE_ID}::transfer::transfer_with_fee`,
        typeArguments: ["0x2::sui::SUI"],
        arguments: [
          splitCoin,
          tx.pure.u64(amountInMist),
          tx.pure.address(recipient),
        ],
      });
    } else {
      // For no-fee transfers, split from gas coin and transfer directly
      const [splitCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist)]);
      tx.transferObjects([splitCoin], tx.pure.address(recipient));
    }

    // Set gas budget and sender
    tx.setGasBudget(5_000_000); // ~= 0.005 SUI
    tx.setSender(currentAccount.address);

    const result = await signAndExecuteTransaction({
      transaction: tx as any,
    });

    return result;
  };

  // Card management handler functions
  const handleFundCard = () => {
    setPendingCardAction("fund");
    setPinModalOpen(true);
  };

  const handleWithdrawFromCard = () => {
    setPendingCardAction("withdraw");
    setPinModalOpen(true);
  };

  const handleFundWithPin = async () => {
    setPinError("");
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      setPinError("Please enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      // Fetch encrypted card from Supabase
      const { data, error } = await supabase
        .from("virtual_cards")
        .select("encrypted_card")
        .eq("wallet_address", walletAddress)
        .single();

      if (error || !data?.encrypted_card) {
        setPinError("Card not found");
        setLoading(false);
        return;
      }

      const decrypted = decryptCardBlob(data.encrypted_card);
      if (decrypted.pin !== pinInput) {
        setPinError("Incorrect PIN");
        setLoading(false);
        return;
      }

      // Transfer from connected wallet to card wallet with fee
      await transferSpecificAmount(
        parseFloat(fundAmount),
        decrypted.address,
        true
      );

      // Show success alert
      setSuccessMessage(
        `✅ Successfully funded card with ${fundAmount} SUI (with fee)!`
      );
      setShowSuccessAlert(true);
      setPinModalOpen(false);
      setPinInput("");
      setFundAmount("");

      // Refresh card data
      await refreshCardData();
    } catch (err: any) {
      console.error("Error funding card:", err);
      setPinError(`Failed to fund card: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawWithPin = async () => {
    setPinError("");
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setPinError("Please enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      // Fetch encrypted card from Supabase
      const { data, error } = await supabase
        .from("virtual_cards")
        .select("encrypted_card")
        .eq("wallet_address", walletAddress)
        .single();

      if (error || !data?.encrypted_card) {
        setPinError("Card not found");
        setLoading(false);
        return;
      }

      const decrypted = decryptCardBlob(data.encrypted_card);
      if (decrypted.pin !== pinInput) {
        setPinError("Incorrect PIN");
        setLoading(false);
        return;
      }

      // Check if card has sufficient balance
      if (cardWalletBalance < parseFloat(withdrawAmount)) {
        setPinError("Insufficient card balance");
        setLoading(false);
        return;
      }

      // Create a transaction to withdraw from card wallet to connected wallet
      const amountInMist = BigInt(
        Math.floor(parseFloat(withdrawAmount) * 1_000_000_000)
      );

      const tx = new Transaction();

      // Split the amount from the card's coin and transfer to connected wallet
      const [splitCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist)]);
      tx.transferObjects(
        [splitCoin],
        tx.pure.address(currentAccount?.address || "")
      );

      // Set gas budget and sender
      tx.setGasBudget(5_000_000); // ~= 0.005 SUI
      tx.setSender(decrypted.address); // Use card wallet as sender

      console.log("Withdraw transaction:", {
        amount: withdrawAmount,
        from: decrypted.address,
        to: currentAccount?.address || "",
        amountInMist: amountInMist.toString(),
      });

      // Create keypair from card's private key
      const cardKeypair = Ed25519Keypair.fromSecretKey(decrypted.privateKey);

      // Build the transaction
      const builtTx = await tx.build({ client: suiClient as any });

      // Sign with card's private key
      const signature = await cardKeypair.signTransaction(builtTx);

      // Execute the transaction
      const result = await suiClient.executeTransactionBlock({
        transactionBlock: builtTx,
        signature: signature.signature,
        options: {
          showEffects: true,
          showInput: true,
        },
      });

      // Show success alert
      setSuccessMessage(
        `✅ Successfully withdrew ${withdrawAmount} SUI from card!`
      );
      setShowSuccessAlert(true);
      setPinModalOpen(false);
      setPinInput("");
      setWithdrawAmount("");

      // Refresh card data
      await refreshCardData();
    } catch (err: any) {
      console.error("Error withdrawing from card:", err);
      setPinError(`Failed to withdraw: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Decrypt card blob
  function decryptCardBlob(ciphertext: string) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_SECRET);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  useEffect(() => {
    const fetchCard = async () => {
      if (!walletAddress) return;

      try {
        const { data, error } = await supabase
          .from("virtual_cards")
          .select("encrypted_card")
          .eq("wallet_address", walletAddress)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching card:", error);
          setDecryptedCard(null);
          return;
        }

        if (data?.encrypted_card) {
          try {
            const bytes = CryptoJS.AES.decrypt(
              data.encrypted_card,
              ENCRYPTION_SECRET
            );
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            const cardObj = JSON.parse(decrypted);
            setDecryptedCard(cardObj);

            // Fetch card wallet balance
            if (cardObj.address) {
              await fetchCardWalletBalance(cardObj.address);
            }

            // Log decrypted card details and shortened wallet address
            console.log("Decrypted Card Details:", cardObj);
            console.log(
              "Wallet Address (short):",
              shortenAddress(walletAddress)
            );
          } catch (e) {
            console.error("Error decrypting card:", e);
            setDecryptedCard(null);
          }
        } else {
          setDecryptedCard(null);
        }
      } catch (err) {
        console.error("Unexpected error fetching card:", err);
        setDecryptedCard(null);
      }
    };
    fetchCard();
  }, [walletAddress, suiClient]);

  return (
    <div className="p-6 md:px-6 lg:px-10 mt-10">
      {/* Header */}
      <Header name={name} walletAddress={walletAddress} />
      {/* Profile */}
      <div className="bg-gray-900 rounded-xl p-6 mb-8 h-auto">
        <div className="flex items-center gap-4 mb-6"></div>

        {/* Card Header */}
        <div className="">
          <h3 className="text-lg font-semibold mb-2">Card</h3>
          <p className="text-sm text-gray-400 mb-6">
            Use your digital assets like cash. Instantly pay online or in-store
            with a secure virtual card accepted worldwide.
          </p>

          {/* Tab Buttons */}
          <div className="flex gap-2 mb-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold text-sm">
              Virtual Card Details
            </button>
            <button className="bg-gray-800 text-white px-4 py-2 rounded-md font-semibold text-sm">
              Card Benefits
            </button>
          </div>

          {/* Card + Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 ">
            {/* Virtual Card Preview with Custom Background */}
            <div className="flex flex-col gap-5">
              <p className="text-sm mb-2">Virtual Card</p>
              {decryptedCard ? (
                <Card
                  cardNumber={
                    decryptedCard.cardDetails?.cardNumber ||
                    decryptedCard.cardNumber
                  }
                  cardHolder={
                    decryptedCard.cardDetails?.cardHolder ||
                    decryptedCard.cardHolder
                  }
                  expiry={
                    decryptedCard.cardDetails?.expiry || decryptedCard.expiry
                  }
                  cvv={decryptedCard.cardDetails?.cvv || decryptedCard.cvv}
                  walletAddress={decryptedCard.address}
                  balance={cardWalletBalance}
                />
              ) : (
                <div className="text-gray-400">
                  No card found for this wallet.
                </div>
              )}
            </div>
            <ATMCard
              cardNumber="1234 5678 9012 3456"
              holderName="JOHN DOE"
              expiryDate="12/25"
              cvv="123"
            />

            {/* Card Management Section */}
            {decryptedCard && (
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-3">
                    Card Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Card Balance:</span>
                      <span className="text-xl font-bold text-green-400">
                        {cardWalletBalance.toFixed(4)} SUI
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Card Wallet:</span>
                      <span className="text-sm font-mono">
                        {decryptedCard?.address
                          ? `${decryptedCard.address.slice(
                              0,
                              6
                            )}...${decryptedCard.address.slice(-4)}`
                          : "Not available"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                    onClick={handleFundCard}
                  >
                    Fund Card
                  </button>
                  <button
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm"
                    onClick={handleWithdrawFromCard}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            )}

            {/* Benefits List */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <FaBolt className="text-yellow-400 text-2xl mt-1" />
                <div>
                  <h4 className="text-lg font-semibold">Instant Assess</h4>
                  <p className="text-sm text-gray-400">
                    Get immediate spending power—no waiting, no pre-conversion.
                    Your SUI is ready when you are.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaGlobe className="text-blue-400 text-2xl mt-1" />
                <div>
                  <h4 className="text-lg font-semibold">Global Acceptance</h4>
                  <p className="text-sm text-gray-400">
                    Spend your SUI anywhere Visa or Mastercard is accepted—
                    online, in-store, or for subscriptions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaShieldAlt className="text-green-400 text-2xl mt-1" />
                <div>
                  <h4 className="text-lg font-semibold">On-Chain Security</h4>
                  <p className="text-sm text-gray-400">
                    Keep your assets safe with a non-custodial wallet—your funds
                    stay on-chain until the moment you spend.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaCoins className="text-purple-400 text-2xl mt-1" />
                <div>
                  <h4 className="text-lg font-semibold">
                    Spend and Safe Tokens
                  </h4>
                  <p className="text-sm text-gray-400">
                    Use card spend and safe tokens e.g. SUI, Walrus, Blue,
                    Memefi, Dee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback message */}
      {feedback && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-2 rounded ${
            feedback.startsWith("✅")
              ? "bg-green-800 text-green-200"
              : "bg-red-800 text-red-200"
          }`}
        >
          {feedback}
        </div>
      )}

      {/* PIN Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-xs">
            <h2 className="text-lg font-semibold mb-4">
              {pendingCardAction === "fund"
                ? "Enter PIN to fund your card (with fee)"
                : pendingCardAction === "withdraw"
                ? "Enter PIN to withdraw from card"
                : "Enter your 6-digit PIN"}
            </h2>

            {/* Amount input for fund/withdraw */}
            {(pendingCardAction === "fund" ||
              pendingCardAction === "withdraw") && (
              <div className="mb-4">
                <label className="block text-sm mb-1">Amount (SUI)</label>
                <input
                  type="number"
                  value={
                    pendingCardAction === "fund" ? fundAmount : withdrawAmount
                  }
                  onChange={(e) =>
                    pendingCardAction === "fund"
                      ? setFundAmount(e.target.value)
                      : setWithdrawAmount(e.target.value)
                  }
                  placeholder="Enter amount"
                  step="0.001"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
                {pendingCardAction === "fund" && (
                  <p className="text-xs text-gray-400 mt-1">
                    A small fee will be charged for this transaction
                  </p>
                )}
              </div>
            )}
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              maxLength={6}
              className="w-full p-2 rounded bg-gray-700 text-white text-center text-2xl tracking-widest mb-3"
              placeholder="------"
              autoFocus
            />
            {pinError && (
              <p className="text-red-400 text-sm mb-2">{pinError}</p>
            )}
            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 bg-gray-600 rounded"
                onClick={() => {
                  setPinModalOpen(false);
                  setPinInput("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 rounded"
                onClick={
                  pendingCardAction === "fund"
                    ? handleFundWithPin
                    : handleWithdrawWithPin
                }
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {showSuccessAlert && (
        <SuccessAlert
          message={successMessage}
          onClose={() => setShowSuccessAlert(false)}
          duration={5000}
        />
      )}
    </div>
  );
};

export default CardDetails;
