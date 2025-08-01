// import { useState } from "react";

// interface CardProps {
//   cardNumber: string;
//   cardHolder: string;
//   expiry: string;
//   cvv: string;
//   walletAddress?: string;
//   balance?: number;
// }

// // Helper to shorten wallet address (if applicable)
// const shortenAddress = (address: string) => {
//   if (!address) return "";
//   return `${address.slice(0, 6)}...${address.slice(-4)}`;
// };

// const Card: React.FC<CardProps> = ({
//   cardNumber,
//   cardHolder,
//   expiry,
//   cvv,
//   walletAddress,
//   balance,
// }) => {
//   const [flipped, setFlipped] = useState(false);

//   return (
//     <div className="flex justify-center items-center w-full h-full">
//       <div
//         className="[perspective:1000px] w-[350px] h-[200px]"
//         onClick={() => setFlipped((f) => !f)}
//       >
//         <div
//           className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
//             flipped ? "rotate-y-180" : ""
//           }`}
//         >
//           {/* Front Side */}
//           <div
//             className="absolute inset-0 rounded-lg text-white bg-cover bg-center flex flex-col justify-between p-6 shadow-lg [backface-visibility:hidden]"
//             style={{ backgroundImage: `url(/images/Frame 29631.svg)` }}
//           >
//             {/* Top section - Balance and Wallet Address */}
//             <div className="flex justify-between items-start">
//               <div>
//                 {balance !== undefined && (
//                   <div className="text-sm">
//                     <span className="text-xs opacity-75">Balance</span>
//                     <div className="text-lg font-bold">
//                       {balance.toFixed(4)} SUI
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <div className="text-right">
//                 {walletAddress && (
//                   <div className="text-xs opacity-75">
//                     <div>Card Wallet</div>
//                     <div className="font-mono">
//                       {shortenAddress(walletAddress)}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Middle section - Card Number */}
//             <div className="flex-1 flex items-center">
//               <p className="text-2xl tracking-widest font-mono">{cardNumber}</p>
//             </div>

//             {/* Bottom section - Expiry and Cardholder */}
//             <div className="flex justify-between items-end">
//               <div>
//                 <p className="text-sm font-mono">Exp: {expiry}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm font-mono">
//                   {shortenAddress(cardHolder)}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Back Side */}
//           <div className="absolute inset-0 rounded-lg bg-gray-900 flex flex-col justify-center items-center [transform:rotateY(180deg)] [backface-visibility:hidden] border border-gray-700">
//             <div className="w-3/4 h-6 bg-gray-700 mb-6 rounded"></div>
//             <div className="w-2/3 flex flex-col items-end">
//               <span className="text-xs text-gray-400 mb-1">CVV</span>
//               <span className="bg-white text-black px-4 py-1 rounded font-mono tracking-widest text-lg">
//                 {cvv}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Card;

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
        className="w-full max-w-[350px] sm:max-w-[400px] aspect-[16/10] perspective-1000"
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front Side */}
          <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl">
            <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-800 to-blue-600 relative">
              {/* Waves */}
              <div className="absolute inset-0 opacity-30">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 400 240"
                  fill="none"
                >
                  <path
                    d="M0,80 Q100,40 200,80 T400,80 L400,120 Q300,160 200,120 T0,120 Z"
                    fill="url(#wave1)"
                  />
                  <path
                    d="M0,120 Q100,80 200,120 T400,120 L400,160 Q300,200 200,160 T0,160 Z"
                    fill="url(#wave2)"
                  />
                  <defs>
                    <linearGradient
                      id="wave1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                      <stop
                        offset="50%"
                        stopColor="#3B82F6"
                        stopOpacity="0.6"
                      />
                      <stop
                        offset="100%"
                        stopColor="#1E40AF"
                        stopOpacity="0.4"
                      />
                    </linearGradient>
                    <linearGradient
                      id="wave2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#6366F1" stopOpacity="0.6" />
                      <stop
                        offset="50%"
                        stopColor="#2563EB"
                        stopOpacity="0.4"
                      />
                      <stop
                        offset="100%"
                        stopColor="#1D4ED8"
                        stopOpacity="0.3"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Logo */}
              <div className="absolute top-3 left-3 flex items-center space-x-2 sm:top-5 sm:left-5">
                <img
                  src="/images/logo.svg"
                  alt="SuiLift Logo"
                  className="w-10 w-14 md:w-25 lg:30"
                />
              </div>

              {/* Balance and Wallet Address (top right) */}
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 text-right">
                {balance !== undefined && (
                  <div className="text-white mb-1">
                    <span className="text-[0.6rem] sm:text-xs opacity-75 block">
                      Balance
                    </span>
                    <div className="text-[0.8rem] sm:text-sm font-bold">
                      {balance.toFixed(4)} SUI
                    </div>
                  </div>
                )}
                {walletAddress && (
                  <div className="text-white">
                    <div className="text-[0.6rem] sm:text-xs opacity-75">
                      Card Wallet
                    </div>
                    <div className="font-mono text-[0.6rem] sm:text-xs">
                      {shortenAddress(walletAddress)}
                    </div>
                  </div>
                )}
              </div>

              {/* Card number */}
              <div className="absolute bottom-[3.5rem] md:bottom-[6rem] left-3 sm:left-5">
                <p className="text-white text-[0.67rem] md:text-xl font-mono tracking-widest select-none">
                  {cardNumber}
                </p>
              </div>

              {/* Name & expiry */}
              <div className="absolute flex justify-between items-end w-[88%] left-3 right-3 sm:left-5 sm:right-5 bottom-5 md:bottom-12">
                <div className="">
                  <p className="text-gray-200 text-[0.57rem] sm:text-xs uppercase tracking-wide ">
                    Card Holder
                  </p>
                  <p className="text-white font-semibold text-[0.77rem] sm:text-lg tracking-wide ">
                    {walletAddress ? shortenAddress(walletAddress) : cardHolder}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-200 text-[0.6rem] sm:text-xs uppercase tracking-wide ">
                    Expires
                  </p>
                  <p className="text-white font-semibold text-[0.57rem] sm:text-lg mb-2 md:mb-1">
                    {expiry}
                  </p>
                </div>
              </div>

              {/* Mastercard area */}
              <div className="absolute bottom-2 right-5 md:bottom-4 md:right-8">
                <div className="flex items-center">
                  <img
                    src="/images/suilift logo.svg"
                    alt="SuiLift Logo"
                    className="w-5.5 sm:w-10"
                  />
                </div>
              </div>

              {/* Chip */}
              <div className="absolute top-12 md:top-20 left-3 sm:left-6 w-8 md:w-12 h-5 md:h-7 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded shadow-inner flex items-center justify-center">
                <div className="grid grid-cols-4 gap-[1px]">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 bg-yellow-600 rounded-full"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-2xl">
            <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-800 to-blue-600">
              {/* Stripe */}
              <div className="w-full h-8 md:h-12 bg-black mt- sm:mt-0"></div>

              {/* CVV */}
              <div className="px-3 pt-2 md:pt-7 sm:px-6">
                <div className="bg-white rounded py- md:py-2 px-4 w-12 md:w-24 ml-auto">
                  <span className="text-black font-mono text-sm sm:text-base">
                    {cvv}
                  </span>
                </div>
                <p className="text-white text-xs mt-1 text-right">CVV</p>
              </div>

              {/* Notice */}
              <div className="px-3 pt-2 md:pt-5 sm:px-6">
                <p className="text-gray-300 text-[9px] md:text-xs leading-relaxed">
                  This card is property of Swift Bank. If found, please return
                  to any Swift Bank branch or call 1-800-SWIFT.
                </p>
              </div>

              {/* Logo again */}
              <div className="absolute bottom-2 left-3 sm:bottom-5 sm:left-6">
                <img
                  src="/images/logo.svg"
                  alt="SuiLift Logo"
                  className="w-12 sm:w-20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
