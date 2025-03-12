import React, { useState } from 'react';
import { User, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthPageProps {
  onLogin: (userData: { phone: string }) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerify, setOtpVerify] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<number | null>(null); // To store user ID after signup

  // Step 1: Sign up and send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number and email
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      // Send sign up request to the backend
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone }),
      });

      if (!response.ok) {
        throw new Error('Error during sign up');
      }

      const data = await response.json();
      setUserId(data.id); // Store user ID for later use in OTP verification
      setOtpSent(true);
      setOtpVerify(false)
      setError(''); // Clear any errors
    } catch (err) {
      setError(err.message);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }

    try {
      // Verify OTP with the backend
      const response = await fetch(`http://localhost:3000/OTPVerify/${userId}/${otp}`);

      if (!response.ok) {
        throw new Error('Invalid OTP');
      };
      if (response.status === 401) {
        throw new Error('Time Out');
      };
      if (response.status === 402) {
        throw new Error('Invalid OTP');
      };

      const data = await response.json();
      console.log('OTP Verified:', data);
      // Proceed to password setup if OTP verification is successful
      setOtpSent(false);
      setOtpVerify(true)
    } catch (err) {
      setError(err.message);
    }
  };

  // Step 3: Set Password
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      // Send the password setup request to the backend
      const response = await fetch(`http://localhost:3000/PasswordUpdate/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Password: password, ConformPassword: confirmPassword }),
      });

      if (!response.ok) {
        throw new Error('Error setting password');
      }

      const data = await response.json();
      console.log('Password setup successful:', data);
      // You can now log the user in or redirect them as needed
      onLogin({ phone });
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle between login and signup forms
  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    setOtpSent(false);
    setError('');
  };

  return (

    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {authMode === 'login'
              ? 'Sign in to access your account'
              : 'Sign up to start shopping with us'}
          </p>
        </div>
            
        {/* Step 1: Sign Up Form */}
        {!otpSent &&  !otpVerify ? (
          <form onSubmit={handleSendOTP}>
            {authMode === 'signup' && (
              <>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1234567890"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send OTP
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
        ) : (
          // Step 2: OTP Verification Form
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-6">
              <div className="text-center mb-4">
                <ShieldCheck className="h-12 w-12 text-indigo-500 mx-auto" />
                <p className="mt-2 text-sm text-gray-600">
                  We've sent a verification code to {phone}
                </p>
              </div>

              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter 4-digit OTP"
                maxLength={4}
                required
              />
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify OTP
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
        )}

        {/* Step 3: Set Password */}
        {  userId ?  (
          <form onSubmit={handleSetPassword}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Set Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter password"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Confirm password"
                required
              />
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Set Password
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
        ) : (
          <div>svdhashgasvd</div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={toggleAuthMode}
              className="ml-1 font-medium text-indigo-600 hover:text-indigo-500"
            >
              {authMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
