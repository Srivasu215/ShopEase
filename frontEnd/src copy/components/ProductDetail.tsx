import React, { useState } from 'react';
import { Star, Heart, Share2, ShoppingCart, ChevronRight } from 'lucide-react';

interface ProductDetailProps {
  onProceedToPayment: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ onProceedToPayment }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedSize, setSelectedSize] = useState('M');

  const product = {
    id: 1,
    name: 'Premium Comfort Sneakers',
    price: 129.99,
    discountPrice: 99.99,
    rating: 4.8,
    reviewCount: 127,
    description: 'Experience unparalleled comfort with our Premium Comfort Sneakers. Designed with advanced cushioning technology and breathable materials, these sneakers provide all-day support for your active lifestyle. The sleek design makes them perfect for both casual outings and light workouts.',
    features: [
      'Lightweight and breathable mesh upper',
      'Memory foam insole for superior comfort',
      'Durable rubber outsole with excellent grip',
      'Moisture-wicking lining keeps feet dry',
      'Reflective details for visibility in low light'
    ],
    colors: ['blue', 'black', 'white', 'red'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ]
  };

  const [mainImage, setMainImage] = useState(product.images[0]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = () => {
    onProceedToPayment();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setMainImage(image)}
                className={`aspect-w-1 aspect-h-1 overflow-hidden rounded-md ${
                  mainImage === image ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-200'
                }`}
              >
                <img 
                  src={image} 
                  alt={`${product.name} view ${index + 1}`} 
                  className="h-full w-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-600">{product.rating} ({product.reviewCount} reviews)</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <p className="text-3xl font-bold text-gray-900">${product.discountPrice}</p>
            <p className="text-lg text-gray-500 line-through">${product.price}</p>
            <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-md">
              {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
            </span>
          </div>

          <p className="text-gray-700">{product.description}</p>

          <div>
            <h3 className="text-sm font-medium text-gray-900">Features</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-gray-600 space-y-1">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900">Color</h3>
            <div className="mt-2 flex space-x-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`relative h-8 w-8 rounded-full border ${
                    selectedColor === color 
                      ? 'ring-2 ring-indigo-500 ring-offset-2' 
                      : 'ring-1 ring-gray-200'
                  }`}
                  style={{ 
                    backgroundColor: color === 'blue' ? '#3b82f6' : 
                                    color === 'black' ? '#000000' : 
                                    color === 'white' ? '#ffffff' : 
                                    color === 'red' ? '#ef4444' : '#cccccc' 
                  }}
                >
                  <span className="sr-only">{color}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900">Size</h3>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`flex items-center justify-center rounded-md py-2 px-3 text-sm font-medium uppercase ${
                    selectedSize === size
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
            <div className="mt-2 flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="rounded-md bg-gray-100 py-2 px-3 text-sm font-medium text-gray-900 hover:bg-gray-200"
              >
                -
              </button>
              <span className="text-gray-900">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="rounded-md bg-gray-100 py-2 px-3 text-sm font-medium text-gray-900 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Buy Now
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
            <button
              className="flex items-center justify-center rounded-md border border-gray-300 bg-white py-3 px-8 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </button>
          </div>

          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button className="flex items-center text-sm text-gray-500 hover:text-indigo-600">
              <Heart className="mr-1 h-4 w-4" />
              Add to Wishlist
            </button>
            <button className="flex items-center text-sm text-gray-500 hover:text-indigo-600">
              <Share2 className="mr-1 h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;