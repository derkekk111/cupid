import React from 'react';
import { Heart } from 'lucide-react';

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
    <div className="text-center">
      <div className="mb-8 animate-pulse">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <Heart className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Cupid
        </h1>
      </div>
      <div className="w-8 h-8 mx-auto animate-spin">
        <div className="w-full h-full border-4 border-pink-200 border-t-pink-500 rounded-full"></div>
      </div>
    </div>
  </div>
);

export default LoadingScreen;