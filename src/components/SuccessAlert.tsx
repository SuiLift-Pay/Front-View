import { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface SuccessAlertProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const SuccessAlert = ({
  message,
  onClose,
  duration = 5000,
}: SuccessAlertProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setIsVisible(true);

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className='bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-80'>
        <div className='animate-bounce'>
          <FaCheckCircle className='text-2xl text-green-200' />
        </div>
        <div className='flex-1'>
          <p className='font-semibold text-sm'>{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className='text-green-200 hover:text-white transition-colors'
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default SuccessAlert;
