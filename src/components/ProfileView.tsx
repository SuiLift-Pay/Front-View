// src/components/ProfileView.tsx
import { useState, useEffect, useRef } from "react";
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
import CryptoJS from "crypto-js";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

import { supabase } from "../utils/supabaseClient";
import Header from "./Header";
import OfframpModal from "./OfframpModal";
import InstantNftSaleModal from "./InstantNftSaleModal";
import Card from "./Card"; // Added Card component import

const ENCRYPTION_SECRET = import.meta.env.VITE_ENCRYPTION_SECRET as string;
const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID as string;
const TARGET_WALLET = import.meta.env.VITE_TARGET_WALLET as string;

const ProfileView = () => {
  const name = "..";
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const walletAddress = currentAccount?.address ?? "Not connected";
  const [suiBalance, setSuiBalance] = useState<number | null>(null);
  const [suiPrice, setSuiPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [cardExists, setCardExists] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const [coins, setCoins] = useState<
    { coinObjectId: string; balance: string }[]
  >([]);
  const [transferType, setTransferType] = useState<"specific" | "all">(
    "specific"
  );
  const [transferStatus, setTransferStatus] = useState<string | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [estimatedGas] = useState<number>(0.005);
  const [isOfframpOpen, setIsOfframpOpen] = useState(false);
  const [isInstantNftSaleOpen, setIsInstantNftSaleOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Card-related state variables
  const [cardWalletBalance, setCardWalletBalance] = useState<number>(0);
  const [decryptedCard, setDecryptedCard] = useState<any>(null);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [pendingCardAction, setPendingCardAction] = useState<
    "create" | "fund" | "withdraw" | "reveal"
  >("create");
  const [fundAmount, setFundAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [revealModalOpen, setRevealModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Fetch SUI price from CoinGecko
  const fetchSuiPrice = async () => {
    setPriceLoading(true);
    setPriceError(null);
    try {
      // Try the primary endpoint
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usdt",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("CoinGecko response:", data); // Debug log

      // Check if the response has the expected structure
      if (data && data.sui && typeof data.sui.usdt === "number") {
        setSuiPrice(data.sui.usdt);
      } else if (data && data.sui && typeof data.sui.usdt === "string") {
        // Handle string format
        setSuiPrice(parseFloat(data.sui.usdt));
      } else {
        console.error("Unexpected CoinGecko response format:", data);
        throw new Error("Invalid response format from CoinGecko");
      }
    } catch (error) {
      console.error("Error fetching SUI price:", error);

      // Try fallback endpoint if primary fails
      try {
        const fallbackResponse = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log("Fallback CoinGecko response:", fallbackData);

          if (
            fallbackData &&
            fallbackData.sui &&
            typeof fallbackData.sui.usd === "number"
          ) {
            setSuiPrice(fallbackData.sui.usd);
            return; // Success with fallback
          }
        }
      } catch (fallbackError) {
        console.error("Fallback API also failed:", fallbackError);
      }

      setPriceError("Failed to fetch price");
      setSuiPrice(null);
    } finally {
      setPriceLoading(false);
    }
  };

  useEffect(() => {
    const fetchBalanceAndCard = async () => {
      if (!currentAccount?.address) {
        setSuiBalance(null);
        setCoins([]);

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

        // Load recent transactions for total spent calculation
        const txData = await suiClient.queryTransactionBlocks({
          filter: { FromAddress: currentAccount.address },
          limit: 50,
          order: "descending",
          options: {
            showEffects: true,
            showInput: true,
          },
        });

        setTransactions(
          txData.data.map((tx) => ({
            digest: tx.digest,
            type: "Transaction",
            status: tx.effects?.status?.status || "Unknown",
            gasUsed: tx.effects?.gasUsed,
            timestamp: tx.timestampMs || undefined,
          }))
        );
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setFeedback(`❌ Error fetching coins: ${errorMessage}`);
      }

      // Fetch card details from Supabase
      try {
        const { data, error } = await supabase
          .from("virtual_cards")
          .select("*")
          .eq("wallet_address", currentAccount.address)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching card:", error);
          setFeedback(`❌ Error fetching card: ${error.message}`);
          setCardExists(false);
        } else if (data) {
          setCardExists(true);
          // If card exists, decrypt and load card data
          if (data.encrypted_card) {
            try {
              const decrypted = decryptCardBlob(data.encrypted_card);
              setDecryptedCard(decrypted);
              // Fetch the card wallet balance
              if (decrypted.address) {
                await fetchCardWalletBalance(decrypted.address);
              }
            } catch (err: any) {
              console.error("Error decrypting card:", err);
              setFeedback(`❌ Error decrypting card: ${err.message}`);
            }
          }
        } else {
          setCardExists(false);
        }
      } catch (err: any) {
        console.error("Unexpected error fetching card:", err);
        setFeedback(`❌ Unexpected error: ${err.message}`);
        setCardExists(false);
      }
    };
    fetchBalanceAndCard();
  }, [currentAccount, suiClient]);

  // Fetch SUI price on component mount and every 30 seconds
  useEffect(() => {
    fetchSuiPrice();
    const interval = setInterval(fetchSuiPrice, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

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

  // Helper function to find the best coin for transfer (highest balance)
  const findBestCoin = () => {
    if (coins.length === 0) return null;
    return coins.reduce((best, current) =>
      parseFloat(current.balance) > parseFloat(best.balance) ? current : best
    );
  };

  // Helper function to transfer a specific amount of SUI
  const transferSpecificAmount = async (
    amount: number,
    recipient: string,
    useFee: boolean = false
  ) => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }

    const bestCoin = findBestCoin();
    if (!bestCoin) {
      throw new Error("No SUI coins found in wallet");
    }

    const amountInMist = Math.floor(amount * 1_000_000_000);
    if (amountInMist <= 0) {
      throw new Error("Amount must be greater than 0.");
    }

    // Fetch the latest version and digest of the coin
    const coinObject = await suiClient.getObject({
      id: bestCoin.coinObjectId,
      options: {
        showContent: true,
        showOwner: true,
        showPreviousTransaction: true,
      },
    });

    if (coinObject.error) {
      throw new Error(`Coin not found or invalid: ${coinObject.error.code}`);
    }

    const ownerAddr = coinObject.data?.owner;
    if (
      !ownerAddr ||
      typeof ownerAddr !== "object" ||
      !("AddressOwner" in ownerAddr) ||
      ownerAddr.AddressOwner !== currentAccount.address
    ) {
      throw new Error("You don't own this coin.");
    }

    const version = coinObject.data?.version;
    const digest = coinObject.data?.digest;

    if (!version || !digest) {
      throw new Error("Missing version or digest for coin.");
    }

    const txb = new Transaction();

    if (useFee) {
      // For fee transfers, split the exact amount first, then use transfer_with_fee
      const [splitCoin] = txb.splitCoins(
        txb.objectRef({
          objectId: bestCoin.coinObjectId,
          version,
          digest,
        }),
        [txb.pure.u64(amountInMist)]
      );

      // Use the transfer_with_fee function on the split coin
      txb.moveCall({
        target: `${PACKAGE_ID}::transfer::transfer_with_fee`,
        typeArguments: ["0x2::sui::SUI"],
        arguments: [
          splitCoin,
          txb.pure.u64(amountInMist),
          txb.pure.address(recipient),
        ],
      });
    } else {
      // For no-fee transfers, split the exact amount and transfer it
      const [splitCoin] = txb.splitCoins(
        txb.objectRef({
          objectId: bestCoin.coinObjectId,
          version,
          digest,
        }),
        [txb.pure.u64(amountInMist)]
      );

      // Transfer the split coin directly
      txb.transferObjects([splitCoin], txb.pure.address(recipient));
    }

    // Set gas budget
    txb.setGasBudget(5000000); // 0.005 SUI in MIST

    const result = await new Promise<any>((resolve, reject) => {
      signAndExecuteTransaction(
        {
          transaction: txb as any,
        },
        {
          onSuccess: resolve,
          onError: reject,
        }
      );
    });

    return result;
  };

  // Helper function to transfer entire coin balance (for "Transfer All")
  const transferAllBalance = async (recipient: string) => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }

    const bestCoin = findBestCoin();
    if (!bestCoin) {
      throw new Error("No SUI coins found in wallet");
    }

    // Fetch the latest version and digest of the coin
    const coinObject = await suiClient.getObject({
      id: bestCoin.coinObjectId,
      options: {
        showContent: true,
        showOwner: true,
        showPreviousTransaction: true,
      },
    });

    if (coinObject.error) {
      throw new Error(`Coin not found or invalid: ${coinObject.error.code}`);
    }

    const ownerAddr = coinObject.data?.owner;
    if (
      !ownerAddr ||
      typeof ownerAddr !== "object" ||
      !("AddressOwner" in ownerAddr) ||
      ownerAddr.AddressOwner !== currentAccount.address
    ) {
      throw new Error("You don't own this coin.");
    }

    const version = coinObject.data?.version;
    const digest = coinObject.data?.digest;

    if (!version || !digest) {
      throw new Error("Missing version or digest for coin.");
    }

    const txb = new Transaction();

    // Use the transfer_no_fee function for transferring entire balance
    txb.moveCall({
      target: `${PACKAGE_ID}::transfer::transfer_no_fee`,
      typeArguments: ["0x2::sui::SUI"],
      arguments: [
        txb.objectRef({
          objectId: bestCoin.coinObjectId,
          version,
          digest,
        }),
        txb.pure.address(recipient),
      ],
    });

    // Set gas budget
    txb.setGasBudget(5000000); // 0.005 SUI in MIST

    const result = await new Promise<any>((resolve, reject) => {
      signAndExecuteTransaction(
        {
          transaction: txb as any,
        },
        {
          onSuccess: resolve,
          onError: reject,
        }
      );
    });

    return result;
  };

  // Helper: Generate Sui wallet
  function generateSuiWallet() {
    const keypair = Ed25519Keypair.generate();
    return {
      address: keypair.getPublicKey().toSuiAddress(),
      privateKey: keypair.getSecretKey(),
    };
  }

  // Helper: Encrypt card blob
  function encryptCardBlob(data: object) {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      ENCRYPTION_SECRET
    ).toString();
  }
  // Helper: Decrypt card blob
  function decryptCardBlob(ciphertext: string) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_SECRET);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  // Modified handleGetVirtualCard
  const handleGetVirtualCard = async () => {
    setPendingCardAction("create");
    setPinModalOpen(true);
  };

  // Called after PIN is entered for creation
  const handleCreateCardWithPin = async () => {
    setPinError("");
    if (!/^\d{6}$/.test(pinInput)) {
      setPinError("PIN must be 6 digits");
      return;
    }
    setLoading(true);
    try {
      // First, transfer 0.1 SUI to TARGET_WALLET (without fee)
      setFeedback("🔄 Transferring 0.1 SUI to create virtual card...");
      await transferSpecificAmount(0.1, TARGET_WALLET, false);

      // Generate wallet and card
      const wallet = generateSuiWallet();
      const cardDetails = generateCardDetails();
      // Encrypt all details
      const encrypted = encryptCardBlob({
        address: wallet.address,
        privateKey: wallet.privateKey,
        cardDetails,
        pin: pinInput,
      });

      // Store in Supabase
      if (walletAddress !== "Not connected" && suiBalance !== null) {
        // Convert SUI balance to MIST (integer) for storage as bigint
        const suiBalanceInMist = Math.floor(suiBalance * 1_000_000_000);

        const { error } = await supabase.from("virtual_cards").insert([
          {
            wallet_address: walletAddress,
            encrypted_card: encrypted,
            sui_balance: suiBalanceInMist,
            card_wallet_address: wallet.address,
          },
        ]);
        if (error) {
          console.error("Supabase insert error:", error);
          setFeedback(`❌ Failed to store card: ${error.message}`);
        } else {
          setFeedback(
            "✅ Virtual card created! 0.1 SUI transferred and wallet securely stored!"
          );
          setCardExists(true);
        }
      } else {
        setFeedback("❌ Wallet not connected or balance not available");
      }
      setPinModalOpen(false);
      setPinInput("");
    } catch (err: any) {
      setFeedback(`❌ Failed to create card: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fund card logic
  const handleFundCard = () => {
    setPendingCardAction("fund");
    setPinModalOpen(true);
  };

  // Withdraw from card logic
  const handleWithdrawFromCard = () => {
    setPendingCardAction("withdraw");
    setPinModalOpen(true);
  };

  // Reveal card logic
  const handleRevealCard = () => {
    setPendingCardAction("reveal");
    setPinModalOpen(true);
  };
  const handleRevealWithPin = async () => {
    setPinError("");
    setLoading(true);
    try {
      // Fetch encrypted card from Supabase
      const { data, error } = await supabase
        .from("virtual_cards")
        .select("encrypted_card")
        .eq("wallet_address", walletAddress)
        .single();

      if (error) {
        setPinError(`Database error: ${error.message}`);
        setLoading(false);
        return;
      }

      if (!data?.encrypted_card) {
        setPinError("No card found");
        setLoading(false);
        return;
      }

      const decrypted = decryptCardBlob(data.encrypted_card);
      if (decrypted.pin !== pinInput) {
        setPinError("Incorrect PIN");
        setLoading(false);
        return;
      }
      setDecryptedCard(decrypted);
      setRevealModalOpen(true);
      setPinModalOpen(false);
      setPinInput("");
    } catch (err: any) {
      console.error("Error revealing card:", err);
      setPinError(`Failed to decrypt card: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle fund card with PIN
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

      // Transfer from connected wallet to card wallet
      await transferSpecificAmount(
        parseFloat(fundAmount),
        decrypted.address,
        false
      );

      setFeedback(`✅ Successfully funded card with ${fundAmount} SUI!`);
      setPinModalOpen(false);
      setPinInput("");
      setFundAmount("");

      // Refresh card wallet balance
      await fetchCardWalletBalance(decrypted.address);
    } catch (err: any) {
      console.error("Error funding card:", err);
      setPinError(`Failed to fund card: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle withdraw from card with PIN
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

      // For withdraw, we'll use a different approach
      // Since we can't directly sign with the card's private key in the browser for security reasons,
      // we'll implement a server-side solution or use a different approach

      // For now, we'll show a message that this requires backend implementation
      setPinError(
        "Withdraw functionality requires secure backend implementation. Please contact support for manual withdrawal."
      );

      // TODO: Implement proper withdraw functionality with server-side signing
      // This would require:
      // 1. Send withdrawal request to backend
      // 2. Backend signs transaction with card's private key
      // 3. Backend executes transaction
      // 4. Return result to frontend
    } catch (err: any) {
      console.error("Error withdrawing from card:", err);
      setPinError(`Failed to withdraw: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (transferStatus) {
      setShowSuccessToast(true);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        setShowSuccessToast(false);
        // Optionally clear transferStatus after hiding
        // setTransferStatus(null);
      }, 5000);
    }
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [transferStatus]);

  /* ---------- transfer_sui with fee ---------- */
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount) {
      setTransferError("Please connect your wallet first.");
      return;
    }
    if (!recipient || !amount) {
      setTransferError("Please fill in all fields.");
      return;
    }

    if (!/^0x[0-9a-fA-F]{64}$/.test(recipient)) {
      setTransferError(
        "Invalid recipient address. Must be 64 hex characters after 0x."
      );
      return;
    }

    setTransferStatus("");
    setTransferError("");
    setLoading(true);

    try {
      // Get the best coin for transfer
      const bestCoin = findBestCoin();
      if (!bestCoin) {
        throw new Error("No SUI coins found in wallet");
      }

      // Validate coin balance for specific transfer
      if (transferType === "specific") {
        const amountInSui = parseFloat(amount);
        if (amountInSui <= 0) {
          throw new Error("Amount must be greater than 0.");
        }

        // Fetch coin details to validate balance
        const coinData = await suiClient.getObject({
          id: bestCoin.coinObjectId,
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
        const [transferCoin] = txb.splitCoins(
          txb.object(bestCoin.coinObjectId),
          [txb.pure.u64(amountInMist)]
        );
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
          [txb.object(bestCoin.coinObjectId)],
          txb.pure.address(currentAccount.address)
        );
      } else {
        // For transfer_all, use the entire coin
        txb.moveCall({
          target: `${PACKAGE_ID}::transfer::transfer_all`,
          arguments: [
            txb.object(bestCoin.coinObjectId),
            txb.pure.address(recipient),
          ],
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

  /* ---------- transfer_all without fee ---------- */
  const handleTransferAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount) {
      setTransferError("Please connect your wallet first.");
      return;
    }
    if (!recipient) {
      setTransferError("Please enter recipient address.");
      return;
    }

    if (!/^0x[0-9a-fA-F]{64}$/.test(recipient)) {
      setTransferError(
        "Invalid recipient address. Must be 64 hex characters after 0x."
      );
      return;
    }

    setTransferStatus("");
    setTransferError("");
    setLoading(true);

    try {
      // Use transfer without fee for "transfer all"
      const result = await transferAllBalance(recipient);

      setTransferStatus(
        `Transfer All successful! Digest: ${result.digest} (no fee)`
      );

      // Refetch coins after success
      const coinData = await suiClient.getCoins({
        owner: currentAccount.address,
        coinType: "0x2::sui::SUI",
      });
      setCoins(
        coinData.data.map((coin: any) => ({
          coinObjectId: coin.coinObjectId,
          balance: (Number(coin.balance) / 1_000_000_000).toFixed(3),
        }))
      );
    } catch (err: any) {
      console.error("Transfer All failed:", err);
      setTransferError(`Error: ${err.message || String(err)}`);
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
    <div className="pt-20 pb-6 px-6">
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
                    disabled={loading}
                  >
                    <FaCreditCard />
                    {loading ? "Creating..." : "Get Virtual Card (0.1 SUI)"}
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
                <p className="text-lg">$ SUI Balance</p>
                <p className="text-xl font-bold">
                  {suiBalance?.toFixed(4) || "0.0000"} SUI
                </p>
                <p className="text-md text-green-400">
                  {suiBalance && suiPrice
                    ? `$${(suiBalance * suiPrice).toFixed(2)} USDT`
                    : priceLoading
                    ? "Loading price..."
                    : priceError
                    ? "Price unavailable"
                    : "$0.00 USDT"}
                </p>
                {suiPrice && (
                  <p className="text-xs text-gray-400">
                    1 SUI = ${suiPrice.toFixed(4)} USDT
                  </p>
                )}
                {priceError && (
                  <p className="text-xs text-red-400">{priceError}</p>
                )}
              </div>

              {/* Monthly Spending */}
              <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center gap-2">
                <p className="text-lg">Total Spent</p>
                <p className="text-xl font-bold">
                  {transactions
                    .reduce((total, tx) => {
                      const gasCost = tx.gasUsed?.computationCost
                        ? Number(tx.gasUsed.computationCost) / 1000000000
                        : 0;
                      return total + gasCost;
                    }, 0)
                    .toFixed(4)}{" "}
                  SUI
                </p>
                <p className="text-md text-green-400">
                  {(() => {
                    const totalSpent = transactions.reduce((total, tx) => {
                      const gasCost = tx.gasUsed?.computationCost
                        ? Number(tx.gasUsed.computationCost) / 1000000000
                        : 0;
                      return total + gasCost;
                    }, 0);
                    return suiPrice
                      ? `$${(totalSpent * suiPrice).toFixed(2)} USDT`
                      : priceLoading
                      ? "Loading price..."
                      : priceError
                      ? "Price unavailable"
                      : totalSpent > 0
                      ? "Price unavailable"
                      : "$0.00 USDT";
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Card Section */}
        {cardExists && (
          <div className="bg-gray-900 rounded-xl p-6 mb-8">
            <h3 className="text-md font-medium mb-4">Virtual Card</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card Display */}
              <div className="flex justify-center">
                <Card
                  cardNumber={
                    decryptedCard?.cardDetails?.cardNumber ||
                    "**** **** **** ****"
                  }
                  cardHolder={
                    decryptedCard?.cardDetails?.cardHolder || walletAddress
                  }
                  expiry={decryptedCard?.cardDetails?.expiry || "MM/YY"}
                  cvv={decryptedCard?.cardDetails?.cvv || "***"}
                  walletAddress={decryptedCard?.address}
                  balance={cardWalletBalance}
                />
              </div>

              {/* Card Management */}
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-3">
                    Card Management
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
                    className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded text-sm"
                    onClick={handleRevealCard}
                  >
                    Reveal Details
                  </button>
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
            </div>
          </div>
        )}

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
                <p className="text-lg font-semibold">Transfer SUI</p>
                <p className="text-sm text-gray-400">
                  Send SUI with or without fee
                </p>
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
            <form
              onSubmit={
                transferType === "specific" ? handleTransfer : handleTransferAll
              }
            >
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
              {/* Removed feeOption dropdown from the modal */}
              {transferType === "all" && (
                <div className="mb-4">
                  <div className="w-full p-2 rounded bg-gray-700 text-white">
                    <p className="text-sm text-gray-300">
                      Transfer All (No Fee)
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    All SUI will be transferred without any fee
                  </p>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm mb-1">Available Balance</label>
                <div className="w-full p-2 rounded bg-gray-700 text-white">
                  {suiBalance?.toFixed(4) || "0.0000"} SUI
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  The system will automatically select the best coin for your
                  transfer
                </p>
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

              {/* Cost Breakdown */}
              {transferType === "specific" &&
                amount &&
                parseFloat(amount) > 0 && (
                  <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">
                      Transaction Summary
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Amount to send:</span>
                        <span>{parseFloat(amount).toFixed(4)} SUI</span>
                      </div>
                      {/* Removed fee calculation from cost breakdown */}
                      <div className="flex justify-between">
                        <span>Estimated gas:</span>
                        <span>~{estimatedGas.toFixed(4)} SUI</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-600 pt-1 font-medium">
                        <span>Total outflow:</span>
                        <span>
                          {(parseFloat(amount) + estimatedGas).toFixed(4)} SUI
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      * The wallet may show a higher "potential outflow" as a
                      safety buffer
                    </p>
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
              {showSuccessToast && transferStatus && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg animate-fade-in">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="font-semibold">{transferStatus}</span>
                </div>
              )}
              {transferError && (
                <p className="mt-4 text-red-400">{transferError}</p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* PIN Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-xs">
            <h2 className="text-lg font-semibold mb-4">
              {pendingCardAction === "create"
                ? "Set a 6-digit PIN for your card"
                : pendingCardAction === "fund"
                ? "Enter PIN to fund your card"
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
                  pendingCardAction === "create"
                    ? handleCreateCardWithPin
                    : pendingCardAction === "fund"
                    ? handleFundWithPin
                    : pendingCardAction === "withdraw"
                    ? handleWithdrawWithPin
                    : handleRevealWithPin
                }
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reveal Modal */}
      {revealModalOpen && decryptedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Card & Wallet Details
            </h2>

            {/* Card Details Section */}
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <h3 className="text-md font-semibold mb-2 text-blue-400">
                Card Information
              </h3>
              <div className="mb-2">
                <b>Card Number:</b> {decryptedCard.cardDetails.cardNumber}
              </div>
              <div className="mb-2">
                <b>Expiry:</b> {decryptedCard.cardDetails.expiry}
              </div>
              <div className="mb-2">
                <b>CVV:</b> {decryptedCard.cardDetails.cvv}
              </div>
            </div>

            {/* Wallet Details Section */}
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <h3 className="text-md font-semibold mb-2 text-green-400">
                Wallet Information
              </h3>
              <div className="mb-2">
                <b>Card Wallet Address:</b>
                <div className="font-mono text-xs break-all mt-1">
                  {decryptedCard.address}
                </div>
              </div>
              <div className="mb-2">
                <b>Card Balance:</b>
                <span className="text-green-400 font-bold ml-2">
                  {cardWalletBalance.toFixed(4)} SUI
                </span>
              </div>
              <div className="mb-2">
                <b>Private Key:</b>{" "}
                <div className="font-mono text-xs break-all mt-1 bg-gray-700 p-2 rounded">
                  {decryptedCard.privateKey}
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-600 rounded"
                onClick={() => setRevealModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
