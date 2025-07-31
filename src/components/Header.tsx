// src/components/Header.tsx
import { useState, useEffect } from "react";
import { FaRegCopy, FaCheck, FaSignOutAlt } from "react-icons/fa"; // Added FaSignOutAlt
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit"; // Added useDisconnectWallet
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  name?: string;
  walletAddress?: string;
}

const Header: React.FC<HeaderProps> = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnectWallet } = useDisconnectWallet(); // Added disconnect hook
  const fullAddress = currentAccount?.address ?? "Not connected";
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentAccount) {
      navigate("/signin");
    }
  }, [currentAccount, navigate]);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!currentAccount?.address) return;
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleLogout = () => {
    disconnectWallet(); // Simplified call, no options needed for basic disconnect
  };

  // Helper to shorten the address
  const shortenAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 z-50 bg-gray-00 border-b border-gray-700 shadow-lg">
      <div className="w-full max-w-full px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left side - Welcome message */}
          <div className="flex items-center min-w-0 flex-1">
            <div className="truncate">
              <h1 className="font-semibold text-white text-sm sm:text-base md:text-xl truncate ml-14 md:ml-0">
                Hi, Welcome!
              </h1>
            </div>
          </div>

          {/* Right side - Wallet info and actions */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
            {/* Wallet address - responsive */}
            <span
              className="bg-gray-800 px-1.5 sm:px-2 md:px-4 py-1 rounded text-xs sm:text-sm text-white cursor-pointer truncate max-w-[80px] sm:max-w-[120px] md:max-w-none"
              title={fullAddress}
            >
              <span className="hidden sm:inline">Wallet: </span>
              <span className="sm:hidden">W: </span>
              {shortenAddress(fullAddress)}
            </span>

            {/* Copy button */}
            <button
              className="px-1.5 sm:px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 border border-gray-600 flex items-center transition-colors flex-shrink-0"
              onClick={handleCopy}
              aria-label="Copy wallet address"
            >
              {copied ? (
                <FaCheck className="text-green-400 text-xs sm:text-sm md:text-base" />
              ) : (
                <FaRegCopy className="text-white text-xs sm:text-sm md:text-base" />
              )}
            </button>

            {/* Logout button */}
            <button
              className="px-1.5 sm:px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 border border-gray-600 flex items-center transition-colors flex-shrink-0"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <FaSignOutAlt className="text-white text-xs sm:text-sm md:text-base" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
