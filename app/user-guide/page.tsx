import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export default function UserGuidePage() {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ${inter.className}`}>
      <Navbar />
      
      <div className="pt-25 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            User Guide
          </h1>
          <p className="text-xl text-gray-600">
            Learn how to effectively use The Mound Report to analyze baseball pitching data
          </p>
        </div>

        <div className="space-y-12">
          {/* Getting Started Section */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Getting Started</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Access the App</h3>
                <p>Click "The Mound Report" in the navigation bar.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Search for Pitchers</h3>
                <p>Use the search bar at the top to find specific pitchers by name. The search is case-insensitive and will match partial names.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3. Filter by Team</h3>
                <p className="mb-4">Click "Filter by Team" to show team selection options. Choose from MLB divisions or individual teams to narrow your search.</p>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">4. Create an Account (Optional)</h3>
                <p>Click "Create an Account" to save your favorite pitchers.</p>
              </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <p className="text-purple-800"><strong>Note: </strong>To ensure a player's current team is accurate, we pull it continuously. If a player is currently in the minor leagues for a rehab assignment or they were optioned to the minor leagues, they will be listed on a minor league team.</p>
              </div>
          </section>

          {/* Navigation Section */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Navigating the Interface</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Pitcher Cards</h3>
                <p>Each pitcher is displayed in a card format showing their basic information, team, and available pitch types.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Load More</h3>
                <p>Use the "Load More Pitchers" button at the bottom to display additional results beyond the initial 50 pitchers.</p>
              </div>
            </div>
          </section>

          {/* Data Analysis Section */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Analyzing Pitching Data</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Pitch Type Breakdown</h3>
                <p>Each pitcher card shows all available pitch types with detailed metrics including velocity, usage rate, and effectiveness.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Heatmap Access</h3>
                <p>Click on individual pitch types to view detailed heatmaps showing pitch location patterns and effectiveness zones.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Comparative Analysis</h3>
                <p>Use the team filters to compare pitchers within the same organization or division for scouting and analysis purposes.</p>
              </div>
            </div>
          </section>

          {/* Tips Section */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pro Tips</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Efficient Searching</h3>
                <p>Start with broad team filters, then narrow down with specific names for the most efficient pitcher discovery.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Interpretation</h3>
                <p>Combine multiple metrics (velocity, spin rate, break) for comprehensive pitcher evaluation rather than relying on single statistics.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
