import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      // Send paymentMethod.id to your server to create a payment intent
      console.log(paymentMethod);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                <CardElement options={{style: {base: {fontSize: '16px', color: '#424770', '::placeholder': {color: '#aab7c4'}}}}}/>
            </div>
        </div>
      
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" disabled={!stripe || processing || succeeded} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
        {processing ? 'Processing...' : 'Pay'}
      </button>
      {succeeded && <div className="text-green-500 text-sm">Payment succeeded!</div>}
    </form>
  );
};

export default CheckoutForm;
