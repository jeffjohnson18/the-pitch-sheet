'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import data from '@/public/pitchers.json'; // your JSON file

export default function Page() {
  const [search, setSearch] = useState('');

  const pitchNameMap: { [key: string]: string } = {
    'FF': 'Four-Seam Fastball',
    'SL': 'Slider',
    'CH': 'Changeup',
    'CU': 'Curveball',
    'SI': 'Sinker',
    'FC': 'Cutter',
    'KC': 'Knuckle Curve',
    'FS': 'Splitter',
    'KN': 'Knuckleball',
    'EP': 'Eephus',
    'SC': 'Screwball',
    'ST': 'Sweeper',
  };

  const formatPlayerName = (name: string) => {
    if (name.includes(',')) {
      const [last, first] = name.split(',').map((part) => part.trim());
      return `${first} ${last}`;
    }
    return name;
  };

  const filteredData = data.filter((item: { player_name: string }) =>
    item.player_name.toLowerCase().includes(search.toLowerCase())
  );

  const uniquePlayers = Array.from(new Set(filteredData.map((item) => item.player_name)));

  const getThrowHand = (playerName: string) => {
    const playerEntries = filteredData.filter((item) => item.player_name === playerName);
    if (playerEntries.length > 0) {
      return playerEntries[0].throws;
    }
    return 'R';
  };

  const getArmAngle = (playerName: string) => {
    const playerEntries = filteredData.filter((item) => item.player_name === playerName);
    if (playerEntries.length > 0) {
      const angles = playerEntries
        .map((item) =>
          typeof item.arm_angle === 'number' ? item.arm_angle : parseFloat(item.arm_angle)
        )
        .filter((v) => !isNaN(v));
      if (angles.length > 0) {
        const avg = angles.reduce((a, b) => a + b, 0) / angles.length;
        return avg.toFixed(1); // round to 1 decimal
      }
    }
    return '0.0';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-black">MLB Pitcher Report</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for a player..."
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {uniquePlayers.length === 0 && search && (
          <p className="text-center text-gray-500">No players found.</p>
        )}

        <div className="space-y-10">
          {uniquePlayers.map((player) => {
            const playerData = filteredData.filter((item) => item.player_name === player);
            const vsRight = playerData.filter((item) => item.stand_side === 'R');
            const vsLeft = playerData.filter((item) => item.stand_side === 'L');
            const throwHand = getThrowHand(player);
            const armAngle = getArmAngle(player);

            return (
              <div key={player}>
                {/* Player Name */}
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-semibold text-black">
                    {formatPlayerName(player)} ({throwHand}HP) - Arm Slot: {armAngle}°
                  </h2>
                </div>

                {/* Two tables side by side */}
                <div className="flex flex-col md:flex-row md:justify-center gap-8">
                  {/* Vs RHH Table */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-blue-700 text-center">Vs RHH</h3>
                    <table className="w-full text-sm bg-white rounded-lg shadow-md text-black">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-2 px-2">Pitch</th>
                          <th className="py-2 px-2">Velo</th>
                          <th className="py-2 px-2">Usage</th>
                          <th className="py-2 px-2">Zone%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vsRight.map((item, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="py-1 px-2">
                              {pitchNameMap[item.pitch_type] || item.pitch_type}
                            </td>
                            <td className="py-1 px-2">{item.velocity_range}</td>
                            <td className="py-1 px-2">{item.usage_rate}</td>
                            <td className="py-1 px-2">{item.zone_rate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Vs LHH Table */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-blue-700 text-center">Vs LHH</h3>
                    <table className="w-full text-sm bg-white rounded-lg shadow-md text-black">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-2 px-2">Pitch</th>
                          <th className="py-2 px-2">Velo</th>
                          <th className="py-2 px-2">Usage</th>
                          <th className="py-2 px-2">Zone%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vsLeft.map((item, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="py-1 px-2">
                              {pitchNameMap[item.pitch_type] || item.pitch_type}
                            </td>
                            <td className="py-1 px-2">{item.velocity_range}</td>
                            <td className="py-1 px-2">{item.usage_rate}</td>
                            <td className="py-1 px-2">{item.zone_rate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
