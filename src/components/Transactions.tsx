// const FundingOption = () => {
//   return (
//     <div className='p-6'>
//       <h2 className='text-2xl font-bold'>Funding Option</h2>
//       <p>Select your preferred funding method: SUI Tokens or Fiat.</p>
//     </div>
//   );
// };

// export default FundingOption;

// Transactions.tsx
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import React, { useEffect, useState } from 'react';

interface Transaction {
  digest: string;
  type: string;
  status: string;
  gasUsed?: {
    computationCost: string;
  };
  timestamp?: string;
}

const FundingOption: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentAccount?.address) {
      loadTransactions();
    }
  }, [currentAccount?.address]);

  const loadTransactions = async () => {
    if (!currentAccount?.address) return;

    try {
      setLoading(true);

      // Load recent transactions - query both sent and received transactions
      const txData = await suiClient.queryTransactionBlocks({
        filter: { FromAddress: currentAccount.address },
        limit: 20,
        order: 'descending',
        options: {
          showEffects: true,
          showInput: true,
        },
      });

      setTransactions(
        txData.data.map(tx => {
          // Determine transaction type based on effects
          let type = 'Transfer';
          if (tx.effects?.status?.status === 'success') {
            if (tx.transaction?.data?.sender === currentAccount.address) {
              type = 'Sent';
            } else {
              type = 'Received';
            }
          }

          return {
            digest: tx.digest,
            type: type,
            status: tx.effects?.status?.status || 'Unknown',
            gasUsed: tx.effects?.gasUsed,
            timestamp: tx.timestampMs || undefined,
          };
        })
      );
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-xl'>Loading transactions...</div>
      </div>
    );
  }

  if (!currentAccount?.address) {
    return null; // Optionally, you can display a message or nothing
  }

  return (
    <div className='mt-8 bg-gray-800 rounded-lg p-6'>
      <h2 className='text-xl font-semibold text-white mb-4'>
        Recent Transactions
      </h2>
      {transactions.length === 0 ? (
        <p className='text-gray-400'>No transactions found</p>
      ) : (
        <div className='space-y-4'>
          {transactions.map(tx => (
            <div key={tx.digest} className='bg-gray-700 rounded p-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='text-gray-400'>Type:</span>
                  <span
                    className={`ml-2 font-semibold ${
                      tx.type === 'Received'
                        ? 'text-green-400'
                        : tx.type === 'Sent'
                          ? 'text-red-400'
                          : 'text-blue-400'
                    }`}
                  >
                    {tx.type}
                  </span>
                </div>
                <div>
                  <span className='text-gray-400'>Status:</span>
                  <span
                    className={`ml-2 ${
                      tx.status === 'success'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
                <div>
                  <span className='text-gray-400'>Gas Used:</span>
                  <span className='text-white ml-2'>
                    {tx.gasUsed?.computationCost
                      ? `${Number(tx.gasUsed.computationCost) / 1000000} SUI`
                      : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className='text-gray-400'>Digest:</span>
                  <span className='text-white ml-2 font-mono text-xs'>
                    {tx.digest.slice(0, 20)}...
                  </span>
                </div>
                {tx.timestamp && (
                  <div className='md:col-span-2'>
                    <span className='text-gray-400'>Time:</span>
                    <span className='text-white ml-2'>
                      {new Date(Number(tx.timestamp)).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FundingOption;
