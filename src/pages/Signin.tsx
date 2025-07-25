// import React from "react";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebook, FaApple } from "react-icons/fa";

// const Signin = () => {
//   return (
//     <main className="signin-page text-white flex justify-center items-center min-h-screen py-8 sm:py-12 md:py-20">
//       <main className="border bg-gray-800/70 backdrop-blur-md px-4 py-8 sm:px-8 sm:py-10 md:px-12 md:py-15 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl text-white">
//         <section className="border px-4 py-8 sm:px-8 sm:py-10 md:px-12 md:py-15 rounded-2xl shadow-2xl w-full text-white">
//           <div className="text-center mb-">
//             <img
//               src="images/logo.svg"
//               alt="SuiLift Logo"
//               className="mx-auto w-50 h-50 -mt-15"
//             />

//             <p className="text-xl -mt-15">Start Spending Crypto Instantly</p>
//           </div>
//           {/* Social Login Buttons */}
//           <div className="space-y-5 mt-10">
//             <form className="space-y-4 mt-6">
//               {/* <div>
//                 <label
//                   htmlFor="name"
//                   className="block mb-1 text-sm font-medium"
//                 >
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   placeholder="Enter your name"
//                   className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   autoComplete="name"
//                 />
//               </div> */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block mb-1 text-sm font-medium"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   placeholder="Enter your email"
//                   className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   autoComplete="email"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block mb-1 text-sm font-medium"
//                 >
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   placeholder="Enter your password"
//                   className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   autoComplete="current-password"
//                 />
//               </div>
//               {/* CAPTCHA */}
//               <div className="mt-6">
//                 <div className="border rounded-3xl p-3 flex items-center justify-between">
//                   <label className="flex items-center space-x-2">
//                     <input type="checkbox" />
//                     <span className="text-white">I'm not a robot</span>
//                   </label>
//                   <img
//                     src="images/recaptcha-icon.svg"
//                     alt="reCAPTCHA"
//                     className="w-8 h-8"
//                   />
//                 </div>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold text-white transition-colors"
//               >
//                 Sign Up
//               </button>
//               <div className="flex items-center my-2">
//                 <div className="flex-grow h-px bg-gray-600" />
//                 <span className="mx-3 text-gray-400">or</span>
//                 <div className="flex-grow h-px bg-gray-600" />
//               </div>
//               <button className="flex items-center justify-center w-full py-3 bg-white text-black rounded-full hover:opacity-90">
//                 <FcGoogle className="w-5 h-5 mr-2" />
//                 Continue with Google
//               </button>
//             </form>
//           </div>

//           {/* Already have an account */}
//           <div className="mt-4 text-xs text-gray-400 text-center">
//             Don't have an account?{" "}
//             <a
//               href="/signup"
//               className="text-blue-400 underline hover:text-blue-600 transition-colors"
//             >
//               Sign Up
//             </a>
//           </div>
//         </section>
//       </main>
//     </main>
//   );
// };

// export default Signin;

import { FcGoogle } from "react-icons/fc";
import {
	useConnectWallet,
	useCurrentAccount,
	useWallets,
} from '@mysten/dapp-kit';
import {
	isEnokiWallet,
	type EnokiWallet,
	type AuthProvider,
} from '@mysten/enoki';
import { useNavigate } from 'react-router-dom';

export default function Signin() {
	const currentAccount = useCurrentAccount();
	const { mutate: connect } = useConnectWallet();
	const navigate = useNavigate();

	const wallets = useWallets().filter(isEnokiWallet);
	const walletsByProvider = wallets.reduce(
		(map, wallet) => map.set(wallet.provider, wallet),
		new Map<AuthProvider, EnokiWallet>(),
	);

	const googleWallet = walletsByProvider.get('google');
	const facebookWallet = walletsByProvider.get('facebook');
    console.log(currentAccount)
	if (currentAccount) {
		navigate('/dashboard');
		return null;
	}

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
            {googleWallet && (
				<button onClick={() => connect({ wallet: googleWallet })} className="mt-5 flex items-center justify-center w-full py-3 bg-white text-black rounded-full hover:opacity-90">
					<FcGoogle className="w-5 h-5 mr-2" /> Continue with Google
				</button>
			)}
          </div></section></main></main>
			
			
		</div>
	);
}
