// import { useState } from "react";
// import { FaRegCopy, FaCheck } from "react-icons/fa";

// interface HeaderProps {
//   name: string;
//   walletAddress: string;
//   className?: string;
// }

// const Header: React.FC<HeaderProps> = ({
//   name = "Mark Millan",
//   walletAddress = "0x345d...6819 45p9u4",
//   className = "",
// }) => {
//   const [copied, setCopied] = useState(false);
//   const handleCopy = () => {
//     navigator.clipboard.writeText(walletAddress);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1500);
//   };

//   return (
//     <div
//       className={`flex justify-between items-center bg-gray-00 rounded-xl p-4 mb-6 ${className}`}
//     >
//       <div className="flex items-center gap-4">
//         <div>
//           <h1 className=" font-semibold text-white text-xl">Hi {name}!</h1>
//         </div>
//       </div>
//       <div className="flex gap-2 items-center">
//         <span className="bg-gray-800 px-4 py-1 rounded text-sm text-white">
//           wallet: {walletAddress}
//         </span>
//         <button
//           className="ml-2 px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 border border-gray-600 flex items-center"
//           onClick={handleCopy}
//           aria-label="Copy wallet address"
//         >
//           {copied ? (
//             <FaCheck className="text-green-400 text-base" />
//           ) : (
//             <FaRegCopy className="text-white text-base" />
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Header;

import { useState } from "react";
import { FaRegCopy, FaCheck } from "react-icons/fa";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { FaCheckCircle, FaCreditCard } from "react-icons/fa";

interface HeaderProps {
  name?: string;
  className?: string;
  onGetVirtualCard?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGetVirtualCard }) => {
  const currentAccount = useCurrentAccount();
  const fullAddress = currentAccount?.address ?? "Not connected";

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!currentAccount?.address) return;
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Helper to shorten the address
  const shortenAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <div
      className={`border-t border-b flex justify-between items-center bg-gray-00 rounded-xl p-6 mb-6 `}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <span
            className="bg-gray-900 px-4 py-1 rounded text-sm text-white cursor-pointer"
            title={fullAddress} // 👈 Shows full address on hover
          >
            Wallet: {shortenAddress(fullAddress)}
          </span>
          <button
            className="ml-2 px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 border border-gray-600 flex items-center"
            onClick={handleCopy}
            aria-label="Copy wallet address"
          >
            {copied ? (
              <FaCheck className="text-green-400 text-base" />
            ) : (
              <FaRegCopy className="text-white text-base" />
            )}
          </button>
        </div>
        <p className="text-green-700 text-sm font-medium flex items-center gap-1">
          KYC:{" "}
          <span className="bg-green-300 px-2 py-1 rounded flex items-center">
            {" "}
            <FaCheckCircle className="text-green-700" /> VERIFIED
          </span>
        </p>
      </div>
      <div className="flex items-cente gap-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
          onClick={onGetVirtualCard}
        >
          <FaCreditCard />
          Get Virtual Card
        </button>
      </div>
    </div>
  );
};

export default Header;
