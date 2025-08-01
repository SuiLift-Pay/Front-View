import { useEffect } from 'react';
import axios from 'axios';

const PAYSTACK_SECRET = import.meta.env.VITE_PAYSTACK_SECRET as string;

const PaystackCallback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    if (reference) {
      axios
        .get(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
          },
        })
        .then(res => {
          if (res.data.data.status === 'success') {
            alert('Payment successful!');
            window.location.href = '/dashboard'; // Redirect to your main page
          } else {
            alert('Payment not successful.');
            window.location.href = '/dashboard';
          }
        })
        .catch(() => {
          alert('Could not verify payment.');
          window.location.href = '/dashboard';
        });
    } else {
      alert('No reference found.');
      window.location.href = '/dashboard';
    }
  }, []);

  return (
    <div className='flex items-center justify-center min-h-screen text-white bg-black'>
      <p>Verifying payment, please wait...</p>
    </div>
  );
};

export default PaystackCallback;
