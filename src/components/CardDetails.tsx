// import { FaBolt, FaGlobe, FaShieldAlt, FaCoins } from "react-icons/fa";

// import Card from "./Card";

// import Header from "./Header";

// const CardDetails = () => {
//   return (
//     <div className="p-6 md:px-6 lg:px-10">
//       {/* Header */}
//       <Header />
//       {/* Profile */}
//       <div className="bg-gray-900 rounded-xl p-6 mb-8 h-auto">
//         {/* Card Header */}
//         <div className="">
//           <h3 className="text-lg font-semibold mb-2">Card</h3>
//           <p className="text-sm text-gray-400 mb-6">
//             Use your digital assets like cash. Instantly pay online or in-store
//             with a secure virtual card accepted worldwide.
//           </p>

//           {/* Tab Buttons */}
//           <div className="flex gap-2 mb-6">
//             <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold text-sm">
//               Virtual Card Details
//             </button>
//             <button className="bg-gray-800 text-white px-4 py-2 rounded-md font-semibold text-sm">
//               Card Benefits
//             </button>
//           </div>

//           {/* Card + Benefits */}
//           <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 ">
//             {/* Virtual Card Preview with Custom Background */}
//             <div className="flex flex-col gap-5">
//               <p className="text-sm mb-2">Virtual Card</p>
//               <Card />
//             </div>

//             {/* Benefits List */}
//             <div className="space-y-6">
//               <div className="flex items-start gap-4">
//                 <FaBolt className="text-yellow-400 text-2xl mt-1" />
//                 <div>
//                   <h4 className="text-lg font-semibold">Instant Assess</h4>
//                   <p className="text-sm text-gray-400">
//                     Get immediate spending power—no waiting, no pre-conversion.
//                     Your SUI is ready when you are.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <FaGlobe className="text-blue-400 text-2xl mt-1" />
//                 <div>
//                   <h4 className="text-lg font-semibold">Global Acceptance</h4>
//                   <p className="text-sm text-gray-400">
//                     Spend your SUI anywhere Visa or Mastercard is accepted—
//                     online, in-store, or for subscriptions.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <FaShieldAlt className="text-green-400 text-2xl mt-1" />
//                 <div>
//                   <h4 className="text-lg font-semibold">On-Chain Security</h4>
//                   <p className="text-sm text-gray-400">
//                     Keep your assets safe with a non-custodial wallet—your funds
//                     stay on-chain until the moment you spend.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <FaCoins className="text-purple-400 text-2xl mt-1" />
//                 <div>
//                   <h4 className="text-lg font-semibold">
//                     Spend and Safe Tokens
//                   </h4>
//                   <p className="text-sm text-gray-400">
//                     Use card spend and safe tokens e.g. SUI, Walrus, Blue,
//                     Memefi, Dee.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CardDetails;

import { useEffect, useState } from "react";
import { FaBolt, FaGlobe, FaShieldAlt, FaCoins } from "react-icons/fa";
import Card from "./Card";
import Header from "./Header";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { supabase } from "../utils/supabaseClient";
import CryptoJS from "crypto-js";
import ATMCard from "./ATMCard"

const ENCRYPTION_SECRET = import.meta.env.VITE_ENCRYPTION_SECRET as string;

const CardDetails = () => {
  const name = "..";
  const currentAccount = useCurrentAccount();
  const walletAddress = currentAccount?.address ?? "";

  const [decryptedCard, setDecryptedCard] = useState<any>(null);

  // Helper to shorten wallet address
  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    const fetchCard = async () => {
      if (!walletAddress) return;
      const { data } = await supabase
        .from("virtual_cards")
        .select("encrypted_card")
        .eq("wallet_address", walletAddress)
        .single();

      if (data?.encrypted_card) {
        try {
          const bytes = CryptoJS.AES.decrypt(
            data.encrypted_card,
            ENCRYPTION_SECRET
          );
          const decrypted = bytes.toString(CryptoJS.enc.Utf8);
          const cardObj = JSON.parse(decrypted);
          setDecryptedCard(cardObj);

          // Log decrypted card details and shortened wallet address
          console.log("Decrypted Card Details:", cardObj);
          console.log("Wallet Address (short):", shortenAddress(walletAddress));
        } catch (e) {
          setDecryptedCard(null);
        }
      } else {
        setDecryptedCard(null);
      }
    };
    fetchCard();
  }, [walletAddress]);

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
                  cardNumber={decryptedCard.cardNumber}
                  cardHolder={decryptedCard.cardHolder}
                  expiry={decryptedCard.expiry}
                  cvv={decryptedCard.cvv}
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
    </div>
  );
};

export default CardDetails;
