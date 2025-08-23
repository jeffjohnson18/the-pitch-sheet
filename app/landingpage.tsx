'use client';

import { Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export default function LandingPage() {
  const router = useRouter();

  const handleProceedToApp = () => {
    router.push('/app');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ${inter.className}`}>
      <Navbar />
      
      {/* Main Content */}
      <div className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="mb-12 text-4xl md:text-5xl font-bold text-gray-800">
            THE <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">MOUND</span> REPORT
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to The Mound Report. Search, filter, and analyze professional baseball pitcher data with heatmaps and performance metrics.
          </p>
        </div>

        {/* How to Use Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-16">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">How to Use</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Getting Started</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Search for pitchers by name</li>
                <li>Filter by team or division</li>
                <li>View detailed analytics and heatmaps</li>
                <li>Save your favorite pitchers</li>
              </ol>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Key Metrics</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li><strong>Velocity:</strong> Pitch speed ranges</li>
                <li><strong>Usage Rate:</strong> How often each pitch is thrown</li>
                <li><strong>Spin Rate:</strong> Ball rotation measurement</li>
                <li><strong>Break Analysis:</strong> Movement patterns</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button
            onClick={handleProceedToApp}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            Proceed to The Mound Report
          </button>
        </div>
      </div>
    </div>
  );
}

