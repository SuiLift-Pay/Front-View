// import { useState } from "react";

// const Card = () => {
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
//             className="absolute inset-0 rounded-lg text-white bg-cover bg-center flex flex-col justify-end p-6 shadow-lg [backface-visibility:hidden]"
//             style={{ backgroundImage: "url('/images/Frame 2963.svg')" }}
//           >
//             <p className="text-md tracking-wides font-mono absolute left-[55%] transform -translate-y-32">
//               Emmanuel Samuel
//             </p>
//             {/* Card Number */}
//             <p className="text-2xl tracking-widest font-mono z-10 absolute top-1/2 left-6 transform -translate-y-1">
//               XXXX XXXX XXXX XXX
//             </p>
//           </div>
//           {/* Back Side */}
//           <div className="absolute inset-0 rounded-lg bg-blue-600 flex flex-col justify-center items-center [transform:rotateY(180deg)] [backface-visibility:hidden] border border-gray-700">
//             <div className="w-3/4 h-6 bg-gray-500 mb-6 rounded"></div>
//             <div className="w-2/3 flex flex-col items-end">
//               <span className="text-xs text-gray-200 mb-1">CVV</span>
//               <span className="bg-white text-black px-4 py-1 rounded font-mono tracking-widest text-lg">
//                 123
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
}

// Helper to shorten wallet address (if applicable)
const shortenAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const Card: React.FC<CardProps> = ({ cardNumber, cardHolder, expiry, cvv }) => {
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
            className="absolute inset-0 rounded-lg text-white bg-cover bg-center flex flex-col justify-end p-10 shadow-lg [backface-visibility:hidden]"
            style={{ backgroundImage: "url('/images/Frame 29631.svg')" }}
          >
            <p className="text-lg tracking-wides font-mono absolute left-[55%] transform -translate-y-29">
              {shortenAddress(cardHolder)}
            </p>
            {/* Card Number */}
            <p className="text-2xl tracking-widest font-mono z-10  absolute top-1/2 left-6 transform -translate-y-1/2">
              {cardNumber}
            </p>
            {/* Expiry */}
            <p className="absolute bottom-6 left-6 text-sm mt-5 font-mono">
              Exp: {expiry}
            </p>
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
