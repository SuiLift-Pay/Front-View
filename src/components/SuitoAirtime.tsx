import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface SuitoAirtimeModalProps {
  open: boolean;
  onClose: () => void;
}

const SuitoAirtime: React.FC<SuitoAirtimeModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-2 relative'>
        <button
          className='w-7 h-7 absolute top-2 right-2 text-gray-700 hover:text-black font-extrabold flex items-center justify-center'
          onClick={onClose}
          aria-label='Close'
        >
          <FaTimes className='w-6 h-6 font-extrabold' />
        </button>
        <h2 className='text-xl font-bold mb-4 text-center'>
          Select NFT to Sell Instantly
        </h2>
        <div className='text-5xl text-black'>COMING SOON</div>
      </div>
    </div>
  );
};
export default SuitoAirtime;
