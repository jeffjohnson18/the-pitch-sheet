'use client';

import { useState } from 'react';
import data from '@/public/pitchers.json'; // We will create this JSON file from your CSV

export default function Page() {
  const [search, setSearch] = useState('');

  // Filter the data based on search input
  const filteredData = data.filter((item: { player_name: string; }) =>
    item.player_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">MLB Pitcher Report</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for a player..."
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e: { target: { value: any; }; }) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left py-3 px-4">Player Name</th>
                <th className="text-left py-3 px-4">Stand Side</th>
                <th className="text-left py-3 px-4">Pitch Type</th>
                <th className="text-left py-3 px-4">Velocity Range</th>
                <th className="text-left py-3 px-4">Usage Rate</th>
                <th className="text-left py-3 px-4">Zone Rate</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item: { player_name: any; stand_side: any; pitch_type: any; velocity_range: any; usage_rate: any; zone_rate: any; }, idx: any) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 px-4">{item.player_name}</td>
                  <td className="py-2 px-4">{item.stand_side}</td>
                  <td className="py-2 px-4">{item.pitch_type}</td>
                  <td className="py-2 px-4">{item.velocity_range}</td>
                  <td className="py-2 px-4">{item.usage_rate}</td>
                  <td className="py-2 px-4">{item.zone_rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
