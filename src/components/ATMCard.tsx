// import React, { useState } from 'react';

// const ATMCard = ({
//   cardNumber = "1234 5678 9012 3456",
//   holderName = "JOHN DOE",
//   expiryDate = "12/25",
//   cvv = "123"
// }) => {
//   const [isFlipped, setIsFlipped] = useState(false);

//   const handleCardClick = () => {
//     setIsFlipped(!isFlipped);
//   };

//   return (
//     <div className="perspective-1000 w-96 h-60">
//       <div
//         className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
//           isFlipped ? 'rotate-y-180' : ''
//         }`}
//         onClick={handleCardClick}
//       >
//         {/* Front of the card */}
//         <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl">
//           <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-800 to-blue-600 relative">
//             {/* Wave patterns */}
//             <div className="absolute inset-0 opacity-30">
//               <svg className="w-full h-full" viewBox="0 0 400 240" fill="none">
//                 <path
//                   d="M0,80 Q100,40 200,80 T400,80 L400,120 Q300,160 200,120 T0,120 Z"
//                   fill="url(#wave1)"
//                 />
//                 <path
//                   d="M0,120 Q100,80 200,120 T400,120 L400,160 Q300,200 200,160 T0,160 Z"
//                   fill="url(#wave2)"
//                 />
//                 <defs>
//                   <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
//                     <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
//                     <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.6" />
//                     <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.4" />
//                   </linearGradient>
//                   <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
//                     <stop offset="0%" stopColor="#6366F1" stopOpacity="0.6" />
//                     <stop offset="50%" stopColor="#2563EB" stopOpacity="0.4" />
//                     <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.3" />
//                   </linearGradient>
//                 </defs>
//               </svg>
//             </div>

//             {/* SWIFT Logo and Text */}
//             <div className="absolute top-6 left-6 flex items-center space-x-3">
//             <img
//             src="/images/logo.svg"
//             alt="SuiLift Logo"
//             className="lg:w-30 md:w-25 w-20"
//           />
//             </div>

//             {/* Card Number */}
//             <div className="absolute bottom-20 left-6">
//               <p className="text-white text-xl font-mono tracking-widest">
//                 {cardNumber}
//               </p>
//             </div>

//             {/* Cardholder Name and Expiry */}
//             <div className="absolute bottom-8 left-6 flex justify-between items-end w-5/6">
//               <div>
//                 <p className="text-gray-300 text-xs uppercase tracking-wide">Card Holder</p>
//                 <p className="text-white font-semibold tracking-wide">{holderName}</p>
//               </div>
//               {/* <div className="text-right">
//                 <p className="text-gray-300 text-xs uppercase tracking-wide">Expires</p>
//                 <p className="text-white font-semibold">{expiryDate}</p>
//               </div> */}
//             </div>

//             {/* Mastercard Logo */}
//             <div className="absolute bottom-6 right-6">
//               <div className="flex items-center">
//                 <div className="w-8 h-8 bg-red-500 rounded-full"></div>
//                 <div className="w-8 h-8 bg-yellow-400 rounded-full -ml-3"></div>
//               </div>
//             </div>

//             {/* Chip */}
//             <div className="absolute top-24 left-6 w-12 h-9 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg shadow-inner">
//               <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg flex items-center justify-center">
//                 <div className="grid grid-cols-4 gap-px">
//                   {[...Array(12)].map((_, i) => (
//                     <div key={i} className="w-1 h-1 bg-yellow-600 rounded-full"></div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Back of the card */}
//         <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-2xl">
//           <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-800 to-blue-600">
//             {/* Magnetic Stripe */}
//             <div className="w-full h-12  bg-black mt-6"></div>

//             {/* CVV Section */}
//             <div className="px-6 mt-8">
//               <div className="bg-white rounded p-2 w-20 ml-auto">
//                 <span className="text-black font-mono text-sm">{cvv}</span>
//               </div>
//               <p className="text-white text-xs mt-2 text-right">CVV</p>
//             </div>

//             {/* Additional Info */}
//             <div className="px-6 mt-8">
//               <p className="text-gray-300 text-xs leading-relaxed">
//                 This card is property of Swift Bank. If found, please return to any Swift Bank branch or call 1-800-SWIFT.
//               </p>
//             </div>

//             {/* Swift branding on back */}
//             <div className="absolute bottom-10 left-6">
//             <img
//             src="/images/logo.svg"
//             alt="SuiLift Logo"
//             className="lg:w-30 md:w-25 w-20"
//           />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ATMCard;

import { useState } from 'react';

const ATMCard = ({
  cardNumber = '1234 5678 9012 3456',
  holderName = 'JOHN DOE',
  expiryDate = '12/25',
  cvv = '123',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className='flex justify-center items-center w-full'>
      <div
        className='w-full max-w-[350px] sm:max-w-[400px] aspect-[16/10] perspective-1000'
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT */}
          <div className='absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl'>
            <div className='w-full h-full bg-gradient-to-br from-purple-900 via-blue-800 to-blue-600 relative'>
              {/* Waves */}
              <div className='absolute inset-0 opacity-30'>
                <svg
                  className='w-full h-full'
                  viewBox='0 0 400 240'
                  fill='none'
                >
                  <path
                    d='M0,80 Q100,40 200,80 T400,80 L400,120 Q300,160 200,120 T0,120 Z'
                    fill='url(#wave1)'
                  />
                  <path
                    d='M0,120 Q100,80 200,120 T400,120 L400,160 Q300,200 200,160 T0,160 Z'
                    fill='url(#wave2)'
                  />
                  <defs>
                    <linearGradient
                      id='wave1'
                      x1='0%'
                      y1='0%'
                      x2='100%'
                      y2='0%'
                    >
                      <stop offset='0%' stopColor='#8B5CF6' stopOpacity='0.8' />
                      <stop
                        offset='50%'
                        stopColor='#3B82F6'
                        stopOpacity='0.6'
                      />
                      <stop
                        offset='100%'
                        stopColor='#1E40AF'
                        stopOpacity='0.4'
                      />
                    </linearGradient>
                    <linearGradient
                      id='wave2'
                      x1='0%'
                      y1='0%'
                      x2='100%'
                      y2='0%'
                    >
                      <stop offset='0%' stopColor='#6366F1' stopOpacity='0.6' />
                      <stop
                        offset='50%'
                        stopColor='#2563EB'
                        stopOpacity='0.4'
                      />
                      <stop
                        offset='100%'
                        stopColor='#1D4ED8'
                        stopOpacity='0.3'
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {/* Logo */}
              <div className='absolute top-3 left-3 flex items-center space-x-2 sm:top-5 sm:left-5'>
                <img
                  src='/images/logo.svg'
                  alt='SuiLift Logo'
                  className='w-10 w-14 md:w-25 lg:30'
                />
              </div>
              {/* Card number */}
              <div className='absolute bottom-[3.5rem] md:bottom-[6rem] left-3 sm:left-5'>
                <p className='text-white text-[0.67rem] md:text-xl font-mono tracking-widest select-none'>
                  {cardNumber}
                </p>
              </div>
              {/* Name & expiry */}
              <div className='absolute flex justify-between items-end w-[88%] left-3 right-3 sm:left-5 sm:right-5 bottom-5 md:bottom-12'>
                <div className=''>
                  <p className='text-gray-200 text-[0.57rem] sm:text-xs uppercase tracking-wide '>
                    Card Holder
                  </p>
                  <p className='text-white font-semibold text-[0.77rem] sm:text-lg tracking-wide '>
                    {holderName}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-gray-200 text-[0.6rem] sm:text-xs uppercase tracking-wide '>
                    Expires
                  </p>
                  <p className='text-white font-semibold text-[0.57rem] sm:text-lg mb-2 md:mb-1'>
                    {expiryDate}
                  </p>
                </div>
              </div>
              {/* Mastercard */}
              <div className='absolute bottom-2 right-7 md:bottom-4 md:right-10'>
                <div className='flex items-center'>
                  {/* <div className="w-5 h-5 md:w-7 md:h-7 bg-red-500 rounded-full"></div>
                  <div className="w-5 h-5 md:w-7 md:h-7 bg-yellow-400 rounded-full -ml-3"></div> */}
                  {/* <img
            src="/images/sui.svg"
            alt="SuiLift Cube"
            className="w-4 md:w-7"
          /> */}
                </div>
              </div>
              {/* Chip */}
              <div className='absolute top-12 md:top-20 left-3 sm:left-6 w-8 md:w-12 h-5 md:h-7 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded shadow-inner flex items-center justify-center'>
                <div className='grid grid-cols-4 gap-[1px]'>
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className='w-1 h-1 bg-yellow-600 rounded-full'
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* BACK */}
          <div className='absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-2xl'>
            <div className='w-full h-full bg-gradient-to-br from-purple-900 via-blue-800 to-blue-600'>
              {/* Stripe */}
              <div className='w-full h-8 md:h-12 bg-black mt- sm:mt-0'></div>
              {/* CVV */}
              <div className='px-3 pt-2 md:pt-7 sm:px-6'>
                <div className='bg-white rounded py- md:py-2 px-4 w-12 md:w-24 ml-auto'>
                  <span className='text-black font-mono text-sm sm:text-base'>
                    {cvv}
                  </span>
                </div>
                <p className='text-white text-xs mt-1 text-right'>CVV</p>
              </div>
              {/* Notice */}
              <div className='px-3 pt-2 md:pt-5 sm:px-6'>
                <p className='text-gray-300 text-[9px] md:text-xs leading-relaxed'>
                  This card is property of Swift Bank. If found, please return
                  to any Swift Bank branch or call 1-800-SWIFT.
                </p>
              </div>
              {/* Logo again */}
              <div className='absolute bottom-2 left-3 sm:bottom-5 sm:left-6'>
                <img
                  src='/images/logo.svg'
                  alt='SuiLift Logo'
                  className='w-12 sm:w-20'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATMCard;
