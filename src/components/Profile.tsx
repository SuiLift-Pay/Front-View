// import React, { useState, useEffect } from 'react';
// import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
// import { FaCopy, FaSync } from 'react-icons/fa';

// interface Transaction {
//   digest: string;
//   type: string;
//   status: string;
//   gasUsed?: {
//     computationCost: string;
//   };
//   timestamp?: string;
// }

// const Profile: React.FC = () => {
//   const currentAccount = useCurrentAccount();
//   const suiClient = useSuiClient();
//   const [balance, setBalance] = useState<number>(0);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [copied, setCopied] = useState<string>('');

//   useEffect(() => {
//     if (currentAccount?.address) {
//       loadProfileData();
//     }
//   }, [currentAccount?.address]);

//   const loadProfileData = async () => {
//     if (!currentAccount?.address) return;

//     try {
//       setLoading(true);

//       // Load balance
//       const coinData = await suiClient.getCoins({
//         owner: currentAccount.address,
//         coinType: '0x2::sui::SUI',
//       });

//       // Check if coinData.data exists and is an array
//       if (!coinData.data || !Array.isArray(coinData.data)) {
//         console.warn('No coin data found for wallet:', currentAccount.address);
//         setBalance(0);
//         return;
//       }

//       const total = coinData.data.reduce(
//         (sum, coin) => sum + Number(coin.balance),
//         0
//       );
//       setBalance(total / 1_000_000_000);

//       // Load recent transactions - query both sent and received transactions
//       const txData = await suiClient.queryTransactionBlocks({
//         filter: { FromAddress: currentAccount.address },
//         limit: 20,
//         order: 'descending',
//         options: {
//           showEffects: true,
//           showInput: true,
//         },
//       });

//       setTransactions(
//         txData.data.map(tx => {
//           // Determine transaction type based on effects
//           let type = 'Transfer';
//           if (tx.effects?.status?.status === 'success') {
//             if (tx.transaction?.data?.sender === currentAccount.address) {
//               type = 'Sent';
//             } else {
//               type = 'Received';
//             }
//           }

//           return {
//             digest: tx.digest,
//             type: type,
//             status: tx.effects?.status?.status || 'Unknown',
//             gasUsed: tx.effects?.gasUsed,
//             timestamp: tx.timestampMs || undefined,
//           };
//         })
//       );
//     } catch (error) {
//       console.error('Error loading profile data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyToClipboard = async (text: string, type: string) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopied(type);
//       setTimeout(() => setCopied(''), 2000);
//     } catch (error) {
//       console.error('Failed to copy:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className='flex items-center justify-center h-64'>
//         <div className='text-xl'>Loading profile...</div>
//       </div>
//     );
//   }

//   if (!currentAccount?.address) {
//     return (
//       <div className='flex items-center justify-center h-64'>
//         <div className='text-xl'>Please connect your wallet</div>
//       </div>
//     );
//   }

//   return (
//     <div className='max-w-4xl mx-auto p-6'>
//       <div className='mb-8'>
//         <h1 className='text-3xl font-bold text-white mb-2'>Profile</h1>
//         <p className='text-gray-400'>
//           Manage your wallet and view transaction history
//         </p>
//       </div>

//       <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//         {/* Wallet Address Section */}
//         <div className='bg-gray-800 rounded-lg p-6'>
//           <h2 className='text-xl font-semibold text-white mb-4 flex items-center gap-2'>
//             <FaCopy className='text-blue-400' />
//             Wallet Address
//           </h2>
//           <div className='bg-gray-700 rounded p-3 mb-4'>
//             <p className='text-sm text-gray-300 break-all'>
//               {currentAccount.address}
//             </p>
//           </div>
//           <button
//             onClick={() => copyToClipboard(currentAccount.address, 'address')}
//             className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2'
//           >
//             {copied === 'address' ? 'Copied!' : 'Copy Address'}
//           </button>
//         </div>

//         {/* Balance Section */}
//         <div className='bg-gray-800 rounded-lg p-6'>
//           <h2 className='text-xl font-semibold text-white mb-4 flex items-center gap-2'>
//             <FaSync className='text-green-400' />
//             SUI Balance
//           </h2>
//           <div className='text-2xl font-bold text-green-400 mb-4'>
//             {balance.toFixed(4)} SUI
//           </div>
//           <button
//             onClick={loadProfileData}
//             className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2'
//           >
//             <FaSync className='text-sm' />
//             Refresh Balance
//           </button>
//         </div>
//       </div>

//       {/* Transaction History */}
//       <div className='mt-8 bg-gray-800 rounded-lg p-6'>
//         <h2 className='text-xl font-semibold text-white mb-4'>
//           Recent Transactions
//         </h2>
//         {transactions.length === 0 ? (
//           <p className='text-gray-400'>No transactions found</p>
//         ) : (
//           <div className='space-y-4'>
//             {transactions.map(tx => (
//               <div key={tx.digest} className='bg-gray-700 rounded p-4'>
//                 <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
//                   <div>
//                     <span className='text-gray-400'>Type:</span>
//                     <span
//                       className={`ml-2 font-semibold ${
//                         tx.type === 'Received'
//                           ? 'text-green-400'
//                           : tx.type === 'Sent'
//                             ? 'text-red-400'
//                             : 'text-blue-400'
//                       }`}
//                     >
//                       {tx.type}
//                     </span>
//                   </div>
//                   <div>
//                     <span className='text-gray-400'>Status:</span>
//                     <span
//                       className={`ml-2 ${
//                         tx.status === 'success'
//                           ? 'text-green-400'
//                           : 'text-red-400'
//                       }`}
//                     >
//                       {tx.status}
//                     </span>
//                   </div>
//                   <div>
//                     <span className='text-gray-400'>Gas Used:</span>
//                     <span className='text-white ml-2'>
//                       {tx.gasUsed?.computationCost
//                         ? `${Number(tx.gasUsed.computationCost) / 1000000} SUI`
//                         : 'N/A'}
//                     </span>
//                   </div>
//                   <div>
//                     <span className='text-gray-400'>Digest:</span>
//                     <span className='text-white ml-2 font-mono text-xs'>
//                       {tx.digest.slice(0, 20)}...
//                     </span>
//                   </div>
//                   {tx.timestamp && (
//                     <div className='md:col-span-2'>
//                       <span className='text-gray-400'>Time:</span>
//                       <span className='text-white ml-2'>
//                         {new Date(Number(tx.timestamp)).toLocaleString()}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;

// Profile.tsx
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import React, { useEffect, useState } from 'react';
import { FaCopy, FaSync } from 'react-icons/fa';

const Profile: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string>('');

  useEffect(() => {
    if (currentAccount?.address) {
      loadProfileData();
    }
  }, [currentAccount?.address]);

  const loadProfileData = async () => {
    if (!currentAccount?.address) return;

    try {
      setLoading(true);

      // Load balance
      const coinData = await suiClient.getCoins({
        owner: currentAccount.address,
        coinType: '0x2::sui::SUI',
      });

      // Check if coinData.data exists and is an array
      if (!coinData.data || !Array.isArray(coinData.data)) {
        console.warn('No coin data found for wallet:', currentAccount.address);
        setBalance(0);
        return;
      }

      const total = coinData.data.reduce(
        (sum, coin) => sum + Number(coin.balance),
        0
      );
      setBalance(total / 1_000_000_000);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-xl'>Loading profile...</div>
      </div>
    );
  }

  if (!currentAccount?.address) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-xl'>Please connect your wallet</div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-white mb-2'>Profile</h1>
        <p className='text-gray-400'>
          Manage your wallet and view transaction history
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Wallet Address Section */}
        <div className='bg-gray-800 rounded-lg p-6'>
          <h2 className='text-xl font-semibold text-white mb-4 flex items-center gap-2'>
            <FaCopy className='text-blue-400' />
            Wallet Address
          </h2>
          <div className='bg-gray-700 rounded p-3 mb-4'>
            <p className='text-sm text-gray-300 break-all'>
              {currentAccount.address}
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(currentAccount.address, 'address')}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2'
          >
            {copied === 'address' ? 'Copied!' : 'Copy Address'}
          </button>
        </div>

        {/* Balance Section */}
        <div className='bg-gray-800 rounded-lg p-6'>
          <h2 className='text-xl font-semibold text-white mb-4 flex items-center gap-2'>
            <FaSync className='text-green-400' />
            SUI Balance
          </h2>
          <div className='text-2xl font-bold text-green-400 mb-4'>
            {balance.toFixed(4)} SUI
          </div>
          <button
            onClick={loadProfileData}
            className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2'
          >
            <FaSync className='text-sm' />
            Refresh Balance
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
