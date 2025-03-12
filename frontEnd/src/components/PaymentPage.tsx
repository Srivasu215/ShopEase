import React, { useState } from 'react';
import { ChevronLeft, CreditCard, Smartphone, CheckCircle } from 'lucide-react';

interface PaymentPageProps {
  onBackToProduct: () => void;
  onPaymentComplete: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ onBackToProduct, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Add space after every 4 digits
    let formatted = '';
    for (let i = 0; i < digits.length; i += 4) {
      formatted += digits.slice(i, i + 4) + ' ';
    }
    
    return formatted.trim();
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length > 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4);
    } else {
      return digits;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const validateCardPayment = () => {
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    
    if (!cardName) {
      setError('Please enter the cardholder name');
      return false;
    }
    
    if (expiryDate.length !== 5 || !expiryDate.includes('/')) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    
    if (cvv.length !== 3) {
      setError('Please enter a valid 3-digit CVV');
      return false;
    }
    
    return true;
  };

  const validateUpiPayment = () => {
    // Basic UPI ID validation (username@provider)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    
    if (!upiRegex.test(upiId)) {
      setError('Please enter a valid UPI ID (e.g., username@upi)');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    let isValid = false;
    
    if (paymentMethod === 'card') {
      isValid = validateCardPayment();
    } else {
      isValid = validateUpiPayment();
    }
    
    if (isValid) {
      setIsProcessing(true);
      
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        onPaymentComplete();
      }, 2000);
    }
  };

  const orderSummary = {
    subtotal: 99.99,
    shipping: 5.00,
    tax: 10.50,
    total: 115.49
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <button
          onClick={onBackToProduct}
          className="flex items-center text-sm text-indigo-600 hover:text-indigo-500 mb-6"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Product
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="md:col-span-2">
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
              
              <div className="flex space-x-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 flex items-center justify-center py-2 px-4 border rounded-md ${
                    paymentMethod === 'card'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Credit/Debit Card
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex-1 flex items-center justify-center py-2 px-4 border rounded-md ${
                    paymentMethod === 'upi'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Smartphone className="mr-2 h-5 w-5" />
                  UPI
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {paymentMethod === 'card' ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        id="cardName"
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          id="expiryDate"
                          type="text"
                          value={expiryDate}
                          onChange={handleExpiryDateChange}
                          className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          id="cvv"
                          type="text"
                          value={cvv}
                          onChange={handleCvvChange}
                          className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                      UPI ID
                    </label>
                    <input
                      id="upiId"
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="username@upi"
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Enter your UPI ID (e.g., username@okicici, username@okhdfc)
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                      isProcessing
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>Pay ${orderSummary.total.toFixed(2)}</>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Secure Payment</h3>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Your payment information is encrypted and secure
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Premium Comfort Sneakers (Qty: 1)</span>
                  <span className="font-medium">${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${orderSummary.shipping.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${orderSummary.tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">Total</span>
                    <span className="text-base font-bold text-gray-900">${orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
              
              <div className="text-sm text-gray-600">
                <p className="font-medium">John Doe</p>
                <p>123 Main Street</p>
                <p>Apt 4B</p>
                <p>New York, NY 10001</p>
                <p>United States</p>
                <p className="mt-2">+1 (555) 123-4567</p>
              </div>
              
              <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-500">
                Change address
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;