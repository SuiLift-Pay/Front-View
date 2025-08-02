// src/components/ProfileView.tsx
import { useEffect, useState } from 'react';
import {
  FaCheckCircle,
  FaCreditCard,
  FaExchangeAlt,
  FaImage,
  FaMobileAlt,
  FaWifi,
} from 'react-icons/fa';

import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import CryptoJS from 'crypto-js';
import { supabase } from '../utils/supabaseClient';

import Header from './Header';
import InstantNftSaleModal from './InstantNftSaleModal';
import OfframpModal from './OfframpModal';
import SuccessAlert from './SuccessAlert';
import SuitoAirtime from './SuitoAirtime';
import SuitoData from './SuitoData';

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID as string;
const ENCRYPTION_SECRET = import.meta.env.VITE_ENCRYPTION_SECRET as string;

const ProfileView = () => {
  const name = '..';
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();
  const walletAddress = currentAccount?.address ?? 'Not connected';
  const [suiBalance, setSuiBalance] = useState<number | null>(null);
  const [suiPrice, setSuiPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const [transferType, setTransferType] = useState<'specific' | 'all'>(
    'specific'
  );

  const [transferError, setTransferError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [estimatedGas] = useState<number>(0.005);
  const [isOfframpOpen, setIsOfframpOpen] = useState(false);
  const [isInstantNftSaleOpen, setIsInstantNftSaleOpen] = useState(false);
  const [isAirtimeSaleOpen, setIsAirtimeSaleOpen] = useState(false);
  const [isDataSaleOpen, setIsDataSaleOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Card-related state variables
  const [cardExists, setCardExists] = useState(false);
  const [cardCreationLoading, setCardCreationLoading] = useState(false);
  const [cardCreationError, setCardCreationError] = useState<string | null>(
    null
  );
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Fetch SUI price from CoinGecko
  const fetchSuiPrice = async () => {
    setPriceLoading(true);
    setPriceError(null);
    try {
      // Try the primary endpoint
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usdt',
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('CoinGecko response:', data); // Debug log

      // Check if the response has the expected structure
      if (data && data.sui && typeof data.sui.usdt === 'number') {
        setSuiPrice(data.sui.usdt);
      } else if (data && data.sui && typeof data.sui.usdt === 'string') {
        // Handle string format
        setSuiPrice(parseFloat(data.sui.usdt));
      } else {
        console.error('Unexpected CoinGecko response format:', data);
        throw new Error('Invalid response format from CoinGecko');
      }
    } catch (error) {
      console.error('Error fetching SUI price:', error);

      // Try fallback endpoint if primary fails
      try {
        const fallbackResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd',
          {
            headers: {
              Accept: 'application/json',
            },
          }
        );

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log('Fallback CoinGecko response:', fallbackData);

          if (
            fallbackData &&
            fallbackData.sui &&
            typeof fallbackData.sui.usd === 'number'
          ) {
            setSuiPrice(fallbackData.sui.usd);
            return; // Success with fallback
          }
        }
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
      }

      setPriceError('Failed to fetch price');
      setSuiPrice(null);
    } finally {
      setPriceLoading(false);
    }
  };

  // Check if card exists on component mount
  useEffect(() => {
    const checkCardExists = async () => {
      if (!currentAccount?.address) {
        setCardExists(false);
        return;
      }

      try {
        const { data } = await supabase
          .from("virtual_card")
          .select("encrypted_card")
          .eq("wallet_address", currentAccount.address)
          .single();

        setCardExists(!!data?.encrypted_card);
      } catch (err) {
        setCardExists(false);
      }
    };

    checkCardExists();
  }, [currentAccount?.address]);

  useEffect(() => {
    const fetchBalanceAndCard = async () => {
      if (!currentAccount?.address) {
        setSuiBalance(null);

        return;
      }

      // Fetch SUI balance and coins
      try {
        const coinData = await suiClient.getCoins({
          owner: currentAccount.address,
          coinType: '0x2::sui::SUI',
        });
        const total = coinData.data.reduce(
          (sum, coin) => sum + Number(coin.balance),
          0
        );
        setSuiBalance(total / 1_000_000_000);

        // Load recent transactions for total spent calculation
        const txData = await suiClient.queryTransactionBlocks({
          filter: { FromAddress: currentAccount.address },
          limit: 50,
          order: 'descending',
          options: {
            showEffects: true,
            showInput: true,
          },
        });

        setTransactions(
          txData.data.map(tx => ({
            digest: tx.digest,
            type: 'Transaction',
            status: tx.effects?.status?.status || 'Unknown',
            gasUsed: tx.effects?.gasUsed,
            timestamp: tx.timestampMs || undefined,
          }))
        );
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setFeedback(`❌ Error fetching coins: ${errorMessage}`);
      }
    };
    fetchBalanceAndCard();
  }, [currentAccount, suiClient]);

  // Function to refresh all state data
  const refreshAllData = async () => {
    if (currentAccount?.address) {
      // Refresh balance and coins
      const coinData = await suiClient.getCoins({
        owner: currentAccount.address,
        coinType: '0x2::sui::SUI',
      });
      const total = coinData.data.reduce(
        (sum, coin) => sum + Number(coin.balance),
        0
      );
      setSuiBalance(total / 1_000_000_000);

      // Refresh transactions
      const txData = await suiClient.queryTransactionBlocks({
        filter: { FromAddress: currentAccount.address },
        limit: 50,
        order: 'descending',
        options: {
          showEffects: true,
          showInput: true,
        },
      });

      setTransactions(
        txData.data.map(tx => ({
          digest: tx.digest,
          type: 'Transaction',
          status: tx.effects?.status?.status || 'Unknown',
          gasUsed: tx.effects?.gasUsed,
          timestamp: tx.timestampMs || undefined,
        }))
      );

      // Check card existence
      const { data } = await supabase
        .from("virtual_card")
        .select("encrypted_card")
        .eq("wallet_address", currentAccount.address)
        .single();
      setCardExists(!!data?.encrypted_card);
    }
  };

  // Fetch SUI price on component mount and every 30 seconds
  useEffect(() => {
    fetchSuiPrice();
    const interval = setInterval(fetchSuiPrice, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Helper function to generate card details
  const generateCardDetails = () => {
    // Generate a unique 4-digit prefix using timestamp and random numbers
    const timestamp = Date.now().toString().slice(-3); // Last 3 digits of timestamp
    const randomDigit = Math.floor(Math.random() * 10);
    const uniquePrefix = `${timestamp}${randomDigit}`.padStart(4, '0');

    // Generate the remaining 8 digits (to make total 16: 1921 + 4 unique + 8 remaining)
    const remainingDigits = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 10)
    ).join('');

    // Use "1921" as fixed prefix + unique 4 digits + remaining 8 digits
    const cardNumber = `1921${uniquePrefix}${remainingDigits}`
      .replace(/(.{4})/g, '$1 ')
      .trim();

    const expiryMonth = String(Math.floor(Math.random() * 12) + 1).padStart(
      2,
      '0'
    );
    const expiryYear = String(
      new Date().getFullYear() + Math.floor(Math.random() * 5) + 1
    );
    const expiry = `${expiryMonth}/${expiryYear.slice(-2)}`;

    const cvv = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    const cardHolder = currentAccount?.address || 'CARD HOLDER';

    return {
      cardNumber,
      expiry,
      cvv,
      cardHolder,
    };
  };

  // Helper function to encrypt card details
  const encryptCardDetails = (cardData: any) => {
    return CryptoJS.AES.encrypt(
      JSON.stringify(cardData),
      ENCRYPTION_SECRET
    ).toString();
  };

  // Helper function to generate Sui wallet
  const generateSuiWallet = () => {
    const keypair = new Ed25519Keypair();
    return {
      address: keypair.getPublicKey().toSuiAddress(),
      privateKey: keypair.getSecretKey(),
    };
  };

  // Function to handle virtual card creation
  const handleGetVirtualCard = async () => {
    if (!currentAccount?.address) {
      setCardCreationError('Please connect your wallet first');
      return;
    }

    // Check if card already exists
    const { data: existingCard } = await supabase
      .from("virtual_card")
      .select("encrypted_card")
      .eq("wallet_address", currentAccount.address)
      .single();

    if (existingCard?.encrypted_card) {
      setCardCreationError('You already have a virtual card');
      return;
    }

    // Check if user has sufficient balance (0.1 SUI + gas fees)
    if (!suiBalance || suiBalance < 0.11) {
      setCardCreationError(
        'Insufficient balance. You need at least 0.11 SUI (0.1 for card + gas fees)'
      );
      return;
    }

    // Clear any previous errors and open PIN modal
    setCardCreationError(null);
    setPinError('');
    setPinInput('');
    setConfirmPinInput('');
    setPinModalOpen(true);
  };

  // Function to handle PIN confirmation and card creation
  const handleCreateCardWithPin = async () => {
    if (!currentAccount?.address) {
      setPinError('Please connect your wallet first');
      return;
    }

    // Validate PIN inputs
    if (pinInput.length !== 6) {
      setPinError('PIN must be exactly 6 digits');
      return;
    }

    if (pinInput !== confirmPinInput) {
      setPinError('PINs do not match');
      return;
    }

    setCardCreationLoading(true);
    setPinError('');

    try {
      // Check if user has sufficient balance (0.1 SUI + gas fees)
      if (!suiBalance || suiBalance < 0.11) {
        throw new Error(
          'Insufficient balance. You need at least 0.11 SUI (0.1 for card + gas fees)'
        );
      }

      // Transfer 0.1 SUI to target wallet FIRST (without fee)
      const targetWallet = import.meta.env.VITE_TARGET_WALLET as string;
      if (!targetWallet) {
        throw new Error('Target wallet not configured');
      }

      // Transfer exactly 0.1 SUI to target wallet using the working function
      await transferSpecificAmount(0.1, targetWallet, false);

      // Only proceed with card creation AFTER successful transfer
      console.log('Transfer successful, now creating virtual card...');

      // Generate card details
      const cardDetails = generateCardDetails();
      const wallet = generateSuiWallet();

      // Create card object with user's PIN
      const cardData = {
        cardDetails,
        address: wallet.address,
        privateKey: wallet.privateKey,
        pin: pinInput, // Use user's PIN instead of random
        createdAt: new Date().toISOString(),
      };

      // Encrypt card data
      const encryptedCard = encryptCardDetails(cardData);

      // Save to Supabase
      const { error } = await supabase.from("virtual_card").insert({
        wallet_address: currentAccount.address,
        encrypted_card: encryptedCard,
      });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      setCardExists(true);
      setPinModalOpen(false);
      setPinInput('');
      setConfirmPinInput('');

      // Show success alert
      setSuccessMessage(
        '✅ Virtual card created successfully! 0.1 SUI has been transferred.'
      );
      setShowSuccessAlert(true);

      // Refresh all data
      await refreshAllData();
    } catch (err: any) {
      console.error('Error creating virtual card:', err);
      setPinError(`Failed to create card: ${err.message}`);
    } finally {
      setCardCreationLoading(false);
    }
  };

  // Helper function to transfer a specific amount of SUI
  const transferSpecificAmount = async (
    amount: number,
    recipient: string,
    useFee: boolean = false
  ) => {
    if (!currentAccount) {
      throw new Error('Wallet not connected');
    }

    console.log('Transfer details:', {
      amount,
      recipient,
      useFee,
    });

    const amountInMist = BigInt(Math.floor(amount * 1_000_000_000));
    if (amountInMist <= 0) {
      throw new Error('Amount must be greater than 0.');
    }

    const tx = new Transaction();

    if (useFee) {
      // For fee transfers, split from gas coin and use transfer_with_fee
      const [splitCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist)]);

      // Use the transfer_with_fee function on the split coin
      tx.moveCall({
        target: `${PACKAGE_ID}::transfer::transfer_with_fee`,
        typeArguments: ['0x2::sui::SUI'],
        arguments: [
          splitCoin,
          tx.pure.u64(amountInMist),
          tx.pure.address(recipient),
        ],
      });
    } else {
      // For no-fee transfers, split from gas coin and transfer directly
      const [splitCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist)]);
      tx.transferObjects([splitCoin], tx.pure.address(recipient));
    }

    // Set gas budget and sender
    tx.setGasBudget(5_000_000); // ~= 0.005 SUI
    tx.setSender(currentAccount.address);

    const result = await signAndExecuteTransaction({
      transaction: tx as any,
    });

    return result;
  };

  // Helper function to transfer entire coin balance (for "Transfer All")
  const transferAllBalance = async (recipient: string) => {
    if (!currentAccount) {
      throw new Error('Wallet not connected');
    }

    console.log('Transfer all to:', recipient);

    const tx = new Transaction();

    // Use transferObjects with the gas coin for transferring entire balance
    tx.transferObjects([tx.gas], tx.pure.address(recipient));

    // Set gas budget and sender
    tx.setGasBudget(5_000_000); // ~= 0.005 SUI
    tx.setSender(currentAccount.address);

    const result = await signAndExecuteTransaction({
      transaction: tx as any,
    });

    return result;
  };

  /* ---------- transfer_sui with fee ---------- */
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount) {
      setTransferError('Please connect your wallet first.');
      return;
    }
    if (!recipient || !amount) {
      setTransferError('Please fill in all fields.');
      return;
    }

    if (!/^0x[0-9a-fA-F]{64}$/.test(recipient)) {
      setTransferError(
        'Invalid recipient address. Must be 64 hex characters after 0x.'
      );
      return;
    }

    setTransferError('');
    setLoading(true);

    try {
      const amountValue = parseFloat(amount);
      if (amountValue <= 0) {
        throw new Error('Amount must be greater than 0.');
      }

      // Use the working transferSpecificAmount function
      const result = await transferSpecificAmount(
        amountValue,
        recipient,
        false
      );

      // Show success alert
      setSuccessMessage(
        `✅ Transaction successful! Digest: ${result.digest} (no fee)`
      );
      setShowSuccessAlert(true);

      // Refresh all data
      await refreshAllData();
    } catch (err: any) {
      setTransferError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- transfer_all without fee ---------- */
  const handleTransferAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount) {
      setTransferError('Please connect your wallet first.');
      return;
    }
    if (!recipient) {
      setTransferError('Please enter recipient address.');
      return;
    }

    if (!/^0x[0-9a-fA-F]{64}$/.test(recipient)) {
      setTransferError(
        'Invalid recipient address. Must be 64 hex characters after 0x.'
      );
      return;
    }

    setTransferError('');
    setLoading(true);

    try {
      // Use transfer without fee for "transfer all"
      const result = await transferAllBalance(recipient);

      // Show success alert
      setSuccessMessage(
        `✅ Transfer All successful! Digest: ${result.digest} (no fee)`
      );
      setShowSuccessAlert(true);

      // Refresh all data
      await refreshAllData();
    } catch (err: any) {
      console.error('Transfer All failed:', err);
      setTransferError(`Error: ${err.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Optionally, show decrypted card details
  // let decryptedCard = null;
  // if (cardExists && cardData?.encrypted_card) {
  //   try {
  //     decryptedCard = decryptCardDetails(cardData.encrypted_card);
  //   } catch (e) {
  //     decryptedCard = null;
  //   }
  // }

  useEffect(() => {
    function handlePaystackMessage(event: MessageEvent) {
      if (
        event.origin === window.location.origin &&
        event.data &&
        event.data.paystackSuccess
      ) {
        alert('Payment successful!'); // Or show a custom success UI
        // Optionally, refresh data here
      }
    }
    window.addEventListener('message', handlePaystackMessage);
    return () => window.removeEventListener('message', handlePaystackMessage);
  }, []);

  return (
    <div className='pt-20 pb-6 px-6'>
      <div className='min-h-screen bg-black text-white md:px-6 lg:px-30 py-6 font-sans'>
        {/* Header */}
        <Header name={name} walletAddress={walletAddress} />

        {/* Profile Info */}
        <div className='bg-gray-900 rounded-xl p-6 mb-8'>
          {/* Feedback message */}
          {feedback && (
            <div
              className={`mb-4 px-4 py-2 rounded ${
                feedback.startsWith('✅')
                  ? 'bg-green-800 text-green-200'
                  : 'bg-red-800 text-red-200'
              }`}
            >
              {feedback}
            </div>
          )}

          {/* Card creation error */}
          {cardCreationError && (
            <div className='mb-4 px-4 py-2 rounded bg-red-800 text-red-200'>
              {cardCreationError}
            </div>
          )}

          <div className=''>
            <div className='flex justify-between'>
              <h3 className='text-md font-medium mb-2'>Profile Overview</h3>
            </div>
            <p className='text-sm text-gray-400 mb-4 border-t border-gray-700 pt-4'>
              Manage your Web3 Payment Card Account
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4'>
              {/* Account Status */}
              <div className='bg-gray-800 rounded-lg p-4 flex flex-col items-center gap-2'>
                <p className='text-lg'>Account Status</p>
                <FaCheckCircle className='w-5 h-5 text-green-500' />
                <p className='text-green-500 font-bold flex items-center gap-1'>
                  VERIFIED
                </p>
              </div>

              {/* Total Balance */}
              <div className='bg-gray-800 rounded-lg p-4 flex flex-col items-center gap-2'>
                <p className='text-lg'>$ SUI Balance</p>
                <p className='text-xl font-bold'>
                  {suiBalance?.toFixed(4) || '0.0000'} SUI
                </p>
                <p className='text-md text-green-400'>
                  {suiBalance && suiPrice
                    ? `$${(suiBalance * suiPrice).toFixed(2)} USDT`
                    : priceLoading
                      ? 'Loading price...'
                      : priceError
                        ? 'Price unavailable'
                        : '$0.00 USDT'}
                </p>
                {suiPrice && (
                  <p className='text-xs text-gray-400'>
                    1 SUI = ${suiPrice.toFixed(4)} USDT
                  </p>
                )}
                {priceError && (
                  <p className='text-xs text-red-400'>{priceError}</p>
                )}
              </div>

              {/* Monthly Spending */}
              <div className='bg-gray-800 rounded-lg p-4 flex flex-col items-center gap-2'>
                <p className='text-lg'>Total Spent</p>
                <p className='text-xl font-bold'>
                  {transactions
                    .reduce((total, tx) => {
                      const gasCost = tx.gasUsed?.computationCost
                        ? Number(tx.gasUsed.computationCost) / 1000000000
                        : 0;
                      return total + gasCost;
                    }, 0)
                    .toFixed(4)}{' '}
                  SUI
                </p>
                <p className='text-md text-green-400'>
                  {(() => {
                    const totalSpent = transactions.reduce((total, tx) => {
                      const gasCost = tx.gasUsed?.computationCost
                        ? Number(tx.gasUsed.computationCost) / 1000000000
                        : 0;
                      return total + gasCost;
                    }, 0);
                    return suiPrice
                      ? `$${(totalSpent * suiPrice).toFixed(2)} USDT`
                      : priceLoading
                        ? 'Loading price...'
                        : priceError
                          ? 'Price unavailable'
                          : totalSpent > 0
                            ? 'Price unavailable'
                            : '$0.00 USDT';
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div>
          <h3 className='text-md font-medium mb-3'>Quick Action</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-900 rounded-xl p-6 mb-8'>
            {/* Transfer SUI */}
            <button
              className='bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700'
              onClick={() => setIsModalOpen(true)}
            >
              <div className='flex flex-col items-center gap-2 mb-2'>
                <FaExchangeAlt className='text-orange-600 text-xl' />
                <p className='text-lg font-semibold'>Transfer SUI</p>
                <p className='text-sm text-gray-400'>
                  Send SUI with or without fee
                </p>
              </div>
            </button>

            {/* Offramp */}
            <button
              className='bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700'
              onClick={() => setIsOfframpOpen(true)}
            >
              <div className='flex flex-col items-center gap-2 mb-2'>
                <FaExchangeAlt className='text-green-600 text-xl' />
                <p className='text-lg font-semibold'>Offramp</p>
                <p className='text-sm text-gray-400'>Send $SUI, Get fiat</p>
              </div>
            </button>

            {/* Instant NFT Sale */}
            <button
              className='bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700'
              onClick={() => setIsInstantNftSaleOpen(true)}
            >
              <div className='flex flex-col items-center gap-2 mb-2'>
                <FaImage className='text-purple-600 text-xl' />
                <p className='text-lg font-semibold'>Instant NFT Sale</p>
                <p className='text-sm text-gray-400'>
                  Sell NFT for instant payout
                </p>
              </div>
            </button>

            {/* SUI TO AIRTIME */}
            <button
              className='bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700'
              onClick={() => setIsAirtimeSaleOpen(true)}
            >
              <div className='flex flex-col items-center gap-2 mb-2'>
                <FaMobileAlt className='text-yellow-400 text-xl' />
                <p className='text-lg font-semibold'>Sui to Airtime</p>
                <p className='text-sm text-gray-400'>Buy Airtime Now</p>
              </div>
            </button>

            {/* SUI TO DATA */}
            <button
              className='bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700'
              onClick={() => setIsDataSaleOpen(true)}
            >
              <div className='flex flex-col items-center gap-2 mb-2'>
                <FaWifi className='text-cyan-400 text-xl' />
                <p className='text-lg font-semibold'>Sui to Data</p>
                <p className='text-sm text-gray-400'>Buy Data Now</p>
              </div>
            </button>

            {/* Get Virtual Card */}
            {!cardExists && (
              <button
                className='bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700'
                onClick={handleGetVirtualCard}
                disabled={cardCreationLoading}
              >
                <div className='flex flex-col items-center gap-2 mb-2'>
                  <FaCreditCard className='text-blue-600 text-xl' />
                  <p className='text-lg font-semibold'>Get Virtual Card</p>
                  <p className='text-sm text-gray-400'>
                    {cardCreationLoading
                      ? 'Creating...'
                      : 'Create your virtual card'}
                  </p>
                </div>
              </button>
            )}

            <OfframpModal
              open={isOfframpOpen}
              onClose={() => setIsOfframpOpen(false)}
            />

            <InstantNftSaleModal
              open={isInstantNftSaleOpen}
              onClose={() => setIsInstantNftSaleOpen(false)}
            />
            <SuitoAirtime
              open={isAirtimeSaleOpen}
              onClose={() => setIsAirtimeSaleOpen(false)}
            />
            <SuitoData
              open={isDataSaleOpen}
              onClose={() => setIsDataSaleOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-gray-800 rounded-xl p-6 w-full max-w-md'>
            <h2 className='text-xl font-semibold mb-4'>Transfer SUI</h2>
            <form
              onSubmit={
                transferType === 'specific' ? handleTransfer : handleTransferAll
              }
            >
              <div className='mb-4'>
                <label className='block text-sm mb-1'>Transfer Type</label>
                <select
                  value={transferType}
                  onChange={e =>
                    setTransferType(e.target.value as 'specific' | 'all')
                  }
                  className='w-full p-2 rounded bg-gray-700 text-white'
                >
                  <option value='specific'>Specific Amount</option>
                  <option value='all'>All SUI</option>
                </select>
              </div>
              {/* Removed feeOption dropdown from the modal */}
              {transferType === 'all' && (
                <div className='mb-4'>
                  <div className='w-full p-2 rounded bg-gray-700 text-white'>
                    <p className='text-sm text-gray-300'>
                      Transfer All (No Fee)
                    </p>
                  </div>
                  <p className='text-xs text-gray-400 mt-1'>
                    All SUI will be transferred without any fee
                  </p>
                </div>
              )}
              <div className='mb-4'>
                <label className='block text-sm mb-1'>Available Balance</label>
                <div className='w-full p-2 rounded bg-gray-700 text-white'>
                  {suiBalance?.toFixed(4) || '0.0000'} SUI
                </div>
                <p className='text-xs text-gray-400 mt-1'>
                  The system will automatically select the best coin for your
                  transfer
                </p>
              </div>
              {transferType === 'specific' && (
                <div className='mb-4'>
                  <label className='block text-sm mb-1'>Amount (SUI)</label>
                  <input
                    type='number'
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder='Enter amount in SUI'
                    step='0.001'
                    className='w-full p-2 rounded bg-gray-700 text-white'
                    required
                    disabled={!currentAccount}
                  />
                </div>
              )}

              {/* Cost Breakdown */}
              {transferType === 'specific' &&
                amount &&
                parseFloat(amount) > 0 && (
                  <div className='mb-4 p-3 bg-gray-700 rounded-lg'>
                    <h4 className='text-sm font-medium mb-2'>
                      Transaction Summary
                    </h4>
                    <div className='space-y-1 text-xs'>
                      <div className='flex justify-between'>
                        <span>Amount to send:</span>
                        <span>{parseFloat(amount).toFixed(4)} SUI</span>
                      </div>
                      {/* Removed fee calculation from cost breakdown */}
                      <div className='flex justify-between'>
                        <span>Estimated gas:</span>
                        <span>~{estimatedGas.toFixed(4)} SUI</span>
                      </div>
                      <div className='flex justify-between border-t border-gray-600 pt-1 font-medium'>
                        <span>Total outflow:</span>
                        <span>
                          {(parseFloat(amount) + estimatedGas).toFixed(4)} SUI
                        </span>
                      </div>
                    </div>
                    <p className='text-xs text-gray-400 mt-2'>
                      * The wallet may show a higher "potential outflow" as a
                      safety buffer
                    </p>
                  </div>
                )}

              <div className='mb-4'>
                <label className='block text-sm mb-1'>Recipient Address</label>
                <input
                  type='text'
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                  placeholder='0x...'
                  className='w-full p-2 rounded bg-gray-700 text-white'
                  required
                  disabled={!currentAccount}
                />
              </div>
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  className='px-4 py-2 bg-gray-600 rounded hover:bg-gray-500'
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700'
                  disabled={loading || !currentAccount}
                >
                  {loading ? 'Processing...' : 'Transfer'}
                </button>
              </div>

              {transferError && (
                <p className='mt-4 text-red-400'>{transferError}</p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* PIN Modal for Virtual Card Creation */}
      {pinModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-gray-800 rounded-xl p-6 w-full max-w-md'>
            <h2 className='text-xl font-semibold mb-4'>Create Virtual Card</h2>
            <p className='text-sm text-gray-400 mb-4'>
              Please enter a 6-digit PIN for your virtual card. You'll need this
              PIN to access your card details.
            </p>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm mb-1'>
                  Enter PIN (6 digits)
                </label>
                <input
                  type='password'
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  maxLength={6}
                  className='w-full p-2 rounded bg-gray-700 text-white text-center text-2xl tracking-widest'
                  placeholder='------'
                  autoFocus
                />
              </div>

              <div>
                <label className='block text-sm mb-1'>
                  Confirm PIN (6 digits)
                </label>
                <input
                  type='password'
                  value={confirmPinInput}
                  onChange={e => setConfirmPinInput(e.target.value)}
                  maxLength={6}
                  className='w-full p-2 rounded bg-gray-700 text-white text-center text-2xl tracking-widest'
                  placeholder='------'
                />
              </div>

              {pinError && <p className='text-red-400 text-sm'>{pinError}</p>}

              <div className='bg-gray-700 rounded-lg p-3'>
                <h4 className='text-sm font-medium mb-2'>
                  Card Creation Summary
                </h4>
                <div className='space-y-1 text-xs'>
                  <div className='flex justify-between'>
                    <span>Virtual Card Cost:</span>
                    <span>0.1 SUI</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Estimated gas:</span>
                    <span>~0.002 SUI</span>
                  </div>
                  <div className='flex justify-between border-t border-gray-600 pt-1 font-medium'>
                    <span>Total cost:</span>
                    <span>~0.102 SUI</span>
                  </div>
                </div>
              </div>

              <div className='flex gap-2 justify-end'>
                <button
                  className='px-4 py-2 bg-gray-600 rounded hover:bg-gray-500'
                  onClick={() => {
                    setPinModalOpen(false);
                    setPinInput('');
                    setConfirmPinInput('');
                    setPinError('');
                  }}
                  disabled={cardCreationLoading}
                >
                  Cancel
                </button>
                <button
                  className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700'
                  onClick={handleCreateCardWithPin}
                  disabled={
                    cardCreationLoading ||
                    pinInput.length !== 6 ||
                    confirmPinInput.length !== 6
                  }
                >
                  {cardCreationLoading ? 'Creating...' : 'Create Card'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {showSuccessAlert && (
        <SuccessAlert
          message={successMessage}
          onClose={() => setShowSuccessAlert(false)}
          duration={5000}
        />
      )}
    </div>
  );
};

export default ProfileView;
