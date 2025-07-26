import React, { useEffect, useState } from "react";
import axios from "axios";

interface OfframpModalProps {
  open: boolean;
  onClose: () => void;
}

const OfframpModal: React.FC<OfframpModalProps> = ({ open, onClose }) => {
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
  const [authUrl, setAuthUrl] = useState<string | null>(null); // New state for authorization URL

  // Replace with your Paystack test secret key
  const PAYSTACK_SECRET = "sk_test_b6c1acf1bd7a2d2d4bc068bb47aa78d0d5a0a9ce";

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
            try {
              // Convert nairaEquivalent to kobo (Paystack expects amount in kobo)
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

              // Show the authorization URL to the user (e.g., as a clickable link)
              setAccountError(""); // Clear any previous error
              setLoading(false);
              // Set a state to display the URL below the form
              setAuthUrl(authorizationUrl);
              return; // Stop further execution
            } catch (err: any) {
              setAccountError("Could not initialize transaction. Try again.");
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
        {authUrl && (
          <div className="mb-4">
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
