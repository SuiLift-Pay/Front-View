import { FaBolt, FaGlobe, FaShieldAlt, FaCoins } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

import Header from "./Header";

const CardDetails = () => {
  const name = "Mark Millian";
  const walletAddress = "0x345d...6819 45p9u4";

  return (
    <div className="p-6">
      {/* Header */}
      <Header name={name} walletAddress={walletAddress} />
      {/* Profile */}
      <div className="bg-gray-900 rounded-xl p-6 mb-8 h-auto">
        <div className="flex items-center gap-4 mb-6">
          <img
            src="/images/user.jpg"
            alt="User"
            className="w-14 h-14 rounded-full border"
          />
          <div>
            <h2 className="text-lg font-semibold">Mark Millian</h2>
            <p className="text-green-500 text-sm font-medium flex items-center gap-1">
              <FaCheckCircle />
              KYC: VERIFIED
            </p>
          </div>
        </div>

        {/* Card Header */}
        <div className="border-t border-gray-700 pt-4">
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
            <div className="container">
              <p className="text-sm mb-2">Virtual Card</p>
              <div
                className="rounded-lg relative text-white p- w-[50%] h-[80%] bg-cover bg-center"
                style={{ backgroundImage: "url('/images/Frame 2963.svg')" }}
              >
                <p className="text-md tracking-wides font-mono absolute left-[60%] transform translate-y-6">
                  Emmanuel Samuel
                </p>
                {/* Card Number */}
                <p className="text-2xl tracking-widest font-mono absolute top-1/2 left-6 transform -translate-y-1/2">
                  1234 5678 8900 000
                </p>
              </div>
            </div>

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
