'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import data from '@/public/pitchers.json';

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
    return playerEntries[0]?.throws || 'R';
  };

  const getArmAngle = (playerName: string) => {
    const playerEntries = filteredData.filter((item) => item.player_name === playerName);
    const angles = playerEntries
      .map((item) =>
        typeof item.arm_angle === 'number' ? item.arm_angle : parseFloat(item.arm_angle)
      )
      .filter((v) => !isNaN(v));
    return angles.length > 0 ? (angles.reduce((a, b) => a + b, 0) / angles.length).toFixed(1) : '0.0';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-light mb-6 text-center text-gray-900 tracking-tight">
          MLB <span className="font-semibold text-blue-600">PITCHER</span> REPORT
        </h1>

        <div className="mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for a pitcher..."
            className="w-full p-3 rounded-lg border-0 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {uniquePlayers.length === 0 && search && (
          <p className="text-center text-gray-500">No pitchers match your search</p>
        )}

        <div className="space-y-12">
          {uniquePlayers.map((player) => {
            const playerData = filteredData.filter((item) => item.player_name === player);
            const vsRight = playerData.filter((item) => item.stand_side === 'R');
            const vsLeft = playerData.filter((item) => item.stand_side === 'L');
            const throwHand = getThrowHand(player);
            const armAngle = getArmAngle(player);

            return (
              <div key={player} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Player Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
                  <h2 className="text-xl md:text-2xl font-medium text-center">
                    {formatPlayerName(player)} 
                    <span className="ml-2 font-light opacity-90">
                      ({throwHand}HP • {armAngle}° slot)
                    </span>
                  </h2>
                </div>

                {/* Pitch Tables */}
                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                  {/* Vs RHH Table */}
                  <div className="flex-1 p-4">
                    <h3 className="text-md font-medium mb-3 text-blue-600 uppercase tracking-wider text-center">
                      vs Right Hitters
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                            <th className="pb-2 px-2 text-left">Pitch</th>
                            <th className="pb-2 px-2 text-right">Velo</th>
                            <th className="pb-2 px-2 text-right">Usage</th>
                            <th className="pb-2 px-2 text-right">Zone%</th>
                            <th className="pb-2 px-2 text-right">Hz Break</th>
                            <th className="pb-2 px-2 text-right">Vert Break</th>
                            <th className="pb-2 px-2 text-right">Spin</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {vsRight.map((item, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/50">
                              <td className="py-3 px-2 text-sm font-medium text-gray-900">
                                {pitchNameMap[item.pitch_type] || item.pitch_type}
                              </td>
                              <td className="py-3 px-2 text-sm text-right text-gray-900">
                                {item.velocity_range}
                              </td>
                              <td className="py-3 px-2 text-sm text-right text-gray-900">
                                {item.usage_rate}
                              </td>
                              <td className="py-3 px-2 text-sm text-right text-gray-900">
                                {item.zone_rate}
                              </td>
                              <td className="py-3 px-2 text-sm text-right text-gray-900">
                                {item.avg_horz_break?.toFixed(1)}
                              </td>
                              <td className="py-3 px-2 text-sm text-right text-gray-900">
                                {item.avg_induced_vert_break?.toFixed(1)}
                              </td>
                              <td className="py-3 px-2 text-sm text-right text-gray-900">
                                {item.avg_spin_rate?.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Vs LHH Table */}
                  <div className="flex-1 p-4">
                    <h3 className="text-md font-medium mb-3 text-blue-600 uppercase tracking-wider text-center">
                      vs Left Hitters
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                            <th className="pb-2 px-2 text-left">Pitch</th>
                            <th className="pb-2 px-2 text-right">Velo</th>
                            <th className="pb-2 px-2 text-right">Usage</th>
                            <th className="pb-2 px-2 text-right">Zone%</th>
                            <th className="pb-2 px-2 text-right">Hz Break</th>
                            <th className="pb-2 px-2 text-right">Vert Break</th>
                            <th className="pb-2 px-2 text-right">Spin</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {vsLeft.map((item, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/50">
                              <td className="py-3 px-2 text-sm font-medium text-gray-900">
                                {pitchNameMap[item.pitch_type] || item.pitch_type}
                              </td>
                              <td className="py-3 px-2 text-sm text-right text-gray-900">
                                {item.velocity_range}
                              </td>
                              <td className="py-3 px-2 text-sm text-right text-gray-900">
                                {item.usage_rate}
                              </td>
                              <td className="py-3 px-2 text-sm text-right text-gray-900">
                                {item.zone_rate}
                              </td>
                              <td className="py-3 px-2 text-sm text-right text-gray-900">
                                {item.avg_horz_break?.toFixed(1)}
                              </td>
                              <td className="py-3 px-2 text-sm text-right text-gray-900">
                                {item.avg_induced_vert_break?.toFixed(1)}
                              </td>
                              <td className="py-3 px-2 text-sm text-right text-gray-900">
                                {item.avg_spin_rate?.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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