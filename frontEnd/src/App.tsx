import React, { useState } from 'react';
import { 
  ShoppingBag, 
  User, 
  CreditCard, 
  Smartphone, 
  ArrowRight, 
  ChevronLeft, 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart,
  LogOut
} from 'lucide-react';
import AuthPage from './components/AuthPage';
import ProductDetail from './components/ProductDetail';
import PaymentPage from './components/PaymentPage';

function App() {
  const [currentPage, setCurrentPage] = useState('auth'); // auth, product, payment
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setCurrentPage('product');
  };
console.log('currentPage:',currentPage);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('auth');
  };

  const handleProceedToPayment = () => {
    setCurrentPage('payment');
  };

  const handleBackToProduct = () => {
    setCurrentPage('product');
  };

  const handlePaymentComplete = () => {
    alert('Payment successful! Thank you for your purchase.');
    setCurrentPage('product');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ShopEase</span>
            </div>
            <div className="flex items-center">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="ml-1 text-sm text-gray-700">{user?.phone || 'User'}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-sm text-gray-700 hover:text-indigo-600"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setCurrentPage('auth')}
                  className="flex items-center text-sm text-gray-700 hover:text-indigo-600"
                >
                  <User className="h-5 w-5 mr-1" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'auth' && <AuthPage onLogin={handleLogin} />}
        {currentPage === 'product' && <ProductDetail onProceedToPayment={handleProceedToPayment} />}
        {currentPage === 'payment' && (
          <PaymentPage 
            onBackToProduct={handleBackToProduct} 
            onPaymentComplete={handlePaymentComplete} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ShopEase</h3>
              <p className="text-gray-400 text-sm">
                Your one-stop destination for all your shopping needs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">Products</a></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-400 text-sm">
                123 Shopping Street<br />
                E-commerce City, EC 12345<br />
                support@shopease.com<br />
                +1 (123) 456-7890
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;