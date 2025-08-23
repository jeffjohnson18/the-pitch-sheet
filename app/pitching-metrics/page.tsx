import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export default function PitchingMetricsPage() {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ${inter.className}`}>
      <Navbar />
      
      <div className="pt-25 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Pitching Metrics Explained
          </h1>
          <p className="text-xl text-gray-600">
            Understanding the data behind every pitch in The Mound Report
          </p>
        </div>

        <div className="space-y-12">
          {/* Velocity Section */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Velocity</h2>
            <div className="space-y-4 text-gray-600">
              <p className="text-lg">
                <strong>What it measures:</strong> The speed of the pitch as it leaves the pitcher's hand, typically measured in miles per hour (MPH).
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Fastball Velocity</h3>
                  <p>Four-seam fastballs typically range from 90-100+ MPH. Higher velocity generally correlates with more swing-and-miss potential.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Breaking Ball Velocity</h3>
                  <p>Sliders, curveballs, and other breaking pitches are typically 10-15 MPH slower than fastballs, creating deception.</p>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <p className="text-blue-800"><strong>Pro Tip:</strong> Velocity differential between fastball and breaking ball is often more important than absolute velocity.</p>
              </div>
            </div>
          </section>

          {/* Spin Rate Section */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Spin Rate</h2>
            <div className="space-y-4 text-gray-600">
              <p className="text-lg">
                <strong>What it measures:</strong> The rate at which the ball rotates as it travels toward home plate, measured in revolutions per minute (RPM).
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">High Spin Rate</h3>
                  <p>Creates more movement and "rise" on fastballs, making them appear to defy gravity. Also increases break on breaking balls.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Low Spin Rate</h3>
                  <p>Results in more sink and less movement. Can be effective for inducing ground balls and weak contact.</p>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <p className="text-purple-800"><strong>Key Insight:</strong> Spin rate is often more predictive of success than velocity alone.</p>
              </div>
            </div>
          </section>

          {/* Break Analysis Section */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Break Analysis</h2>
            <div className="space-y-4 text-gray-600">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Horizontal Break</h3>
                  <p>Measures how much the pitch moves left or right from the pitcher's perspective. Positive values indicate movement toward the pitcher's glove side.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Induced Vertical Break</h3>
                  <p>Measures the "rise" or "sink" of the pitch relative to a pitch with no spin. Positive values indicate upward movement.</p>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg mt-4">
                <p className="text-green-800"><strong>Understanding:</strong> Break is what makes pitches effective - it's not just about speed, but about movement and deception.</p>
              </div>
            </div>
          </section>

          {/* Usage Rate Section */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Usage Rate</h2>
            <div className="space-y-4 text-gray-600">
              <p className="text-lg">
                <strong>What it measures:</strong> The percentage of total pitches that are of a specific type (e.g., fastball, slider, changeup).
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Primary Pitches</h3>
                  <p>Most pitchers have 2-3 primary pitches they throw 70-80% of the time. These are their most reliable offerings.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Secondary Pitches</h3>
                  <p>Used 20-30% of the time, often in specific counts or situations. Can be highly effective when well-located.</p>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <p className="text-yellow-800"><strong>Strategy:</strong> Usage patterns can reveal a pitcher's confidence in different pitches and their game plan.</p>
              </div>
            </div>
          </section>

          {/* Zone Rate Section */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Zone Rate</h2>
            <div className="space-y-4 text-gray-600">
              <p className="text-lg">
                <strong>What it measures:</strong> The percentage of pitches that are thrown within the strike zone or in specific zones of the plate.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Strike Zone Command</h3>
                  <p>Higher zone rates indicate better command and ability to throw strikes consistently. Essential for getting ahead in counts.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Zone Targeting</h3>
                  <p>Pitchers often target specific zones (high, low, inside, outside) based on the batter's weaknesses and the game situation.</p>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg mt-4">
                <p className="text-red-800"><strong>Game Impact:</strong> Zone rate directly affects walk rates, pitch counts, and overall effectiveness.</p>
              </div>
            </div>
          </section>

          {/* Pitch Types Section */}
          <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pitch Types & Characteristics</h2>
            <div className="space-y-6 text-gray-600">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Four-Seam Fastball (FF)</h3>
                  <p>Straightest pitch with the most backspin. Used to get ahead in counts and challenge hitters with velocity.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Slider (SL)</h3>
                  <p>Breaking pitch with horizontal and downward movement. Effective against both left and right-handed hitters.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Changeup (CH)</h3>
                  <p>Off-speed pitch designed to look like a fastball but arrive much slower. Creates timing issues for hitters.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Curveball (CU)</h3>
                  <p>Breaking pitch with significant downward movement. Often used as a strikeout pitch in two-strike counts.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Sinker (SI)</h3>
                  <p>Fastball variant with downward movement. Designed to induce ground balls and double plays.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Cutter (FC)</h3>
                  <p>Fastball variant with slight horizontal movement. Often used to jam hitters and induce weak contact.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
