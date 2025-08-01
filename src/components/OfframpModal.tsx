import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useCurrentAccount,
  useSuiClient,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

interface OfframpModalProps {
  open: boolean;
  onClose: () => void;
}

const OfframpModal: React.FC<OfframpModalProps> = ({ open, onClose }) => {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [suiAmount, setSuiAmount] = useState("");
  const [nairaEquivalent, setNairaEquivalent] = useState("");
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountError, setAccountError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [transferStatus, setTransferStatus] = useState<string | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);

  // Replace with your Paystack test secret key
  const PAYSTACK_SECRET = import.meta.env.VITE_PAYSTACK_SECRET as string;

  // Target wallet for offramp transfers
  const TARGET_WALLET = import.meta.env.VITE_TARGET_WALLET as string;

  const bankList = [
    { name: "Access Bank", code: "044" },
    { name: "GTBank", code: "058" },
    { name: "Guaranty Trust Bank", code: "058" },
    { name: "First Bank", code: "011" },
    { name: "UBA", code: "033" },
    { name: "Zenith Bank", code: "057" },
    { name: "PALMPAY", code: "100033" },
    { name: "Opay ", code: "999992" },
    { name: "Kuda Microfinance Bank", code: "50211" },
    { name: "Moniepoint MFB", code: "50515" },
    { name: "VFD Microfinance Bank", code: "50111" },
    { name: "Providus Bank", code: "101" },
    { name: "Fidelity Bank", code: "070" },
    { name: "Stanbic IBTC Bank", code: "068" },
    { name: "Union Bank of Nigeria", code: "032" },
    { name: "Wema Bank", code: "035" },
    { name: "Heritage Bank", code: "030" },
    { name: "Citibank Nigeria", code: "023" },
    { name: "Standard Chartered Bank", code: "068" },
    // ...add more banks as needed
  ];

  const bankCodes: { [key: string]: string } = {};
  bankList.forEach((b) => {
    bankCodes[b.name.toLowerCase()] = b.code;
  });

  // Helper function to find the best coin for transfer (highest balance)
  const findBestCoin = async () => {
    if (!currentAccount?.address) return null;

    const coinData = await suiClient.getCoins({
      owner: currentAccount.address,
      coinType: "0x2::sui::SUI",
    });

    if (coinData.data.length === 0) return null;

    return coinData.data.reduce((best, current) =>
      Number(current.balance) > Number(best.balance) ? current : best
    );
  };

  // Helper function to transfer SUI without requiring coin selection
  const transferSuiWithoutCoinSelection = async (
    amount: number,
    recipient: string
  ) => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }

    const bestCoin = await findBestCoin();
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

    // For offramp transfers, split the exact amount and transfer it (no fee)
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

  // Fetch SUI to NGN rate
  useEffect(() => {
    if (!open) return;
    axios
      .get(
        "https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=ngn"
      )
      .then((res) => setRate(res.data.sui.ngn))
      .catch(() => setRate(null));
  }, [open]);

  // Update naira equivalent
  useEffect(() => {
    if (suiAmount && rate) {
      setNairaEquivalent((parseFloat(suiAmount) * rate).toFixed(2));
    } else {
      setNairaEquivalent("");
    }
  }, [suiAmount, rate]);

  useEffect(() => {
    const fetchAccountName = async () => {
      setAccountName("");
      setAccountError("");
      if (accountNumber.length === 10 && bankName.trim()) {
        const code = bankCodes[bankName.trim().toLowerCase()];
        if (!code) {
          setAccountError("Unsupported bank name.");
          return;
        }
        setVerifying(true);
        try {
          const res = await axios.get(
            `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${code}`,
            {
              headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET}`,
              },
            }
          );
          setAccountName(res.data.data.account_name);
        } catch (err: any) {
          setAccountError("Could not verify account. Check details.");
        } finally {
          setVerifying(false);
        }
      }
    };
    fetchAccountName();
  }, [accountNumber, bankName]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Offramp SUI to Naira</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setAccountError("");
            setTransferError("");
            setTransferStatus("");
            setAuthUrl(null);

            try {
              // First, transfer SUI to the target wallet
              const suiAmountValue = parseFloat(suiAmount);
              if (suiAmountValue <= 0) {
                throw new Error("SUI amount must be greater than 0.");
              }

              setTransferStatus("Transferring SUI to processing wallet...");
              const transferResult = await transferSuiWithoutCoinSelection(
                suiAmountValue,
                TARGET_WALLET
              );
              setTransferStatus(
                `SUI transfer successful! Digest: ${transferResult.digest}`
              );

              // Then proceed with Paystack transaction
              setTransferStatus("Initializing Paystack transaction...");
              const amountKobo = Math.round(Number(nairaEquivalent) * 100);
              const res = await axios.post(
                "https://api.paystack.co/transaction/initialize",
                {
                  email,
                  amount: amountKobo,
                },
                {
                  headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              console.log("Paystack response:", res.data);

              const authorizationUrl = res.data.data.authorization_url;

              setTransferStatus(
                "Paystack transaction initialized successfully!"
              );
              setAuthUrl(authorizationUrl);
              return;
            } catch (err: any) {
              console.error("Offramp failed:", err);
              setTransferError(`Error: ${err.message || String(err)}`);
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="mb-4">
            <label className="block text-sm mb-1">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Bank</label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            >
              <option value="">Select Bank</option>
              {bankList.map((bank) => (
                <option key={bank.code} value={bank.name}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Email (for receipt)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">SUI Amount</label>
            <input
              type="number"
              value={suiAmount}
              onChange={(e) => setSuiAmount(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              step="0.001"
              min="0"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Naira Equivalent</label>
            <input
              type="text"
              value={nairaEquivalent ? `₦${nairaEquivalent}` : ""}
              className="w-full p-2 rounded bg-gray-700 text-white"
              disabled
            />
            {rate && (
              <p className="text-xs text-gray-400 mt-1">
                Rate: 1 SUI ≈ ₦{rate}
              </p>
            )}
          </div>
          <div className="mb-2">
            {verifying && (
              <p className="text-xs text-blue-400">Verifying account...</p>
            )}
            {accountName && (
              <p className="text-xs text-green-400">
                Account Name: {accountName}
              </p>
            )}
            {accountError && (
              <p className="text-xs text-red-400">{accountError}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Processing..." : "Off-Ramp"}
            </button>
          </div>
        </form>
        {transferStatus && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <p className="text-sm text-green-400">{transferStatus}</p>
          </div>
        )}
        {transferError && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <p className="text-sm text-red-400">{transferError}</p>
          </div>
        )}
        {authUrl && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <p className="text-sm text-blue-400 mb-2">
              SUI transferred successfully! Complete your payment:
            </p>
            <a
              href={authUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              Click here to complete your payment on Paystack
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfframpModal;