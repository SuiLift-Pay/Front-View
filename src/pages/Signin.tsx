// import { FcGoogle } from "react-icons/fc";
// import {
//   useConnectWallet,
//   useCurrentAccount,
//   useWallets,
// } from "@mysten/dapp-kit";
// import {
//   isEnokiWallet,
//   type EnokiWallet,
//   type AuthProvider,
// } from "@mysten/enoki";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

// export default function Signin() {
//   const currentAccount = useCurrentAccount();
//   const { mutate: connect } = useConnectWallet();
//   const navigate = useNavigate();

//   const wallets = useWallets().filter(isEnokiWallet);
//   const walletsByProvider = wallets.reduce(
//     (map, wallet) => map.set(wallet.provider, wallet),
//     new Map<AuthProvider, EnokiWallet>()
//   );

//   const googleWallet = walletsByProvider.get("google");

//   console.log(currentAccount);
//   if (currentAccount) {
//     navigate("/dashboard");
//     return null;
//   }

//   return (
//     <div>
//       <main className="signin-page text-white flex justify-center items-center min-h-screen py-8 sm:py-12 md:py-20">
//         <main className="border bg-gray-800/70 backdrop-blur-md px-4 py-8 sm:px-8 sm:py-10 md:px-12 md:py-15 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl text-white">
//           <section className="border px-4 py-8 sm:px-8 sm:py-10 md:px-12 md:py-15 rounded-2xl shadow-2xl w-full text-white">
//             <div className="text-center mb-">
//               <Link to="/">
//                 <img
//                   src="images/logo.svg"
//                   alt="SuiLift Logo"
//                   className="mx-auto w-50 h-50 -mt-15"
//                 />
//               </Link>

//               <p className="text-xl -mt-15">Start Spending Crypto Instantly</p>
//               {googleWallet && (
//                 <button
//                   onClick={() => connect({ wallet: googleWallet })}
//                   className="mt-5 flex items-center justify-center w-full py-3 bg-white text-black rounded-full hover:opacity-90"
//                 >
//                   <FcGoogle className="w-5 h-5 mr-2" /> Continue with Google
//                 </button>
//               )}
//             </div>
//           </section>
//         </main>
//       </main>
//     </div>
//   );
// }

import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaWallet } from "react-icons/fa";
import {
  useConnectWallet,
  useCurrentAccount,
  useWallets,
} from "@mysten/dapp-kit";
import { isEnokiWallet, type EnokiWallet } from "@mysten/enoki";
import { useNavigate } from "react-router-dom";

const SigninContent: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();
  const navigate = useNavigate();

  const wallets = useWallets();
  const enokiWallets = wallets.filter(
    (w) => isEnokiWallet(w) && w.provider !== "facebook"
  );
  const genericWallets = wallets.filter((w) => !isEnokiWallet(w));

  React.useEffect(() => {
    if (currentAccount) {
      navigate("/dashboard");
    }
  }, [currentAccount, navigate]);

  return (
    <div>
      <main className="signin-page text-white flex justify-center items-center min-h-screen py-8 sm:py-12 md:py-20">
        <main className="border bg-gray-800/70 backdrop-blur-md px-4 py-8 sm:px-8 sm:py-10 md:px-12 md:py-15 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl text-white">
          <section className="border px-4 py-8 sm:px-8 sm:py-10 md:px-12 md:py-15 rounded-2xl shadow-2xl w-full text-white">
            <div className="text-center mb-">
              <img
                src="images/logo.svg"
                alt="SuiLift Logo"
                className="mx-auto w-50 h-50 -mt-15"
              />
              <p className="text-xl -mt-15">Start Spending Crypto Instantly</p>
              <div className="flex flex-col gap-4 mt-5">
                {/* Enoki/Google wallets */}
                {enokiWallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => connect({ wallet })}
                    className="flex items-center justify-center w-full py-3 bg-white text-black rounded-full hover:opacity-90"
                  >
                    {(wallet as EnokiWallet).provider === "google" && (
                      <FcGoogle className="w-5 h-5 mr-2" />
                    )}
                    Continue with {wallet.name}
                  </button>
                ))}
                {/* Generic wallets */}
                {genericWallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => connect({ wallet })}
                    className="flex items-center justify-center w-full py-3 bg-white text-black rounded-full hover:opacity-90"
                  >
                    <FaWallet className="w-5 h-5 mr-2" />
                    Connect {wallet.name}
                  </button>
                ))}
                {/* If no wallets detected */}
                {wallets.length === 0 && (
                  <div className="text-red-400 text-sm mt-2">
                    No wallets detected. Please install a Sui wallet extension.
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </main>
    </div>
  );
};

export default function Signin() {
  return <SigninContent />;
}
