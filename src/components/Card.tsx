import { useState } from "react";

interface CardProps {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  walletAddress?: string;
  balance?: number;
}

// Helper to shorten wallet address (if applicable)
const shortenAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const Card: React.FC<CardProps> = ({
  cardNumber,
  cardHolder,
  expiry,
  cvv,
  walletAddress,
  balance,
}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div
        className="[perspective:1000px] w-[350px] h-[200px]"
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front Side */}
          <div
            className="absolute inset-0 rounded-lg text-white bg-cover bg-center flex flex-col justify-between p-6 shadow-lg [backface-visibility:hidden]"
            style={{ backgroundImage: `url(/images/Frame 29631.svg)` }}
          >
            {/* Top section - Balance and Wallet Address */}
            <div className="flex justify-between items-start">
              <div>
                {balance !== undefined && (
                  <div className="text-sm">
                    <span className="text-xs opacity-75">Balance</span>
                    <div className="text-lg font-bold">
                      {balance.toFixed(4)} SUI
                    </div>
                  </div>
                )}
              </div>
              <div className="text-right">
                {walletAddress && (
                  <div className="text-xs opacity-75">
                    <div>Card Wallet</div>
                    <div className="font-mono">
                      {shortenAddress(walletAddress)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Middle section - Card Number */}
            <div className="flex-1 flex items-center">
              <p className="text-2xl tracking-widest font-mono">{cardNumber}</p>
            </div>

            {/* Bottom section - Expiry and Cardholder */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-mono">Exp: {expiry}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono">
                  {shortenAddress(cardHolder)}
                </p>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 rounded-lg bg-gray-900 flex flex-col justify-center items-center [transform:rotateY(180deg)] [backface-visibility:hidden] border border-gray-700">
            <div className="w-3/4 h-6 bg-gray-700 mb-6 rounded"></div>
            <div className="w-2/3 flex flex-col items-end">
              <span className="text-xs text-gray-400 mb-1">CVV</span>
              <span className="bg-white text-black px-4 py-1 rounded font-mono tracking-widest text-lg">
                {cvv}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
