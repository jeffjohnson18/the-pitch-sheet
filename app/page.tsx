'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import data from '@/public/pitchers.json';
import pitcherIds from '@/public/pitcher_ids.json';
import Image from 'next/image';

export default function Page() {
  const [search, setSearch] = useState('');
  const [playerImages, setPlayerImages] = useState<{ [key: string]: string }>({});

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

  const getTeamInfo = (playerName: string) => {
    const playerEntries = filteredData.filter((item) => item.player_name === playerName);
    return {
      teamName: playerEntries[0]?.team_name || 'Unknown Team',
      teamLogo: playerEntries[0]?.team_logo || '',
    };
  };

  const filteredData = data.filter((item: { player_name: string }) =>
    item.player_name.toLowerCase().includes(search.toLowerCase())
  );

  const uniquePlayers = Array.from(new Set(filteredData.map((item) => item.player_name)));

  const getPlayerImage = (playerName: string) => {
    // Match player_name to the pitcher_ids.json
    const playerEntry = pitcherIds.find(
      (p) => p.player_name.toLowerCase() === playerName.toLowerCase()
    );
  
    if (playerEntry && playerEntry.player_id) {
      const id = playerEntry.player_id;
      return `https://img.mlbstatic.com/mlb-photos/image/upload/w_180,q_100/v1/people/${id}/headshot/67/current.jpg`;
    } else {
      console.warn(`No player ID found for ${playerName}`);
      return '/default_player.png'; // fallback image
    }
  };


  useEffect(() => {
    const fetchImages = async () => {
      const images: { [key: string]: string } = {};
      for (const player of uniquePlayers) {
        if (!playerImages[player]) { // don't re-fetch if already loaded
          const img = await getPlayerImage(player);
          images[player] = img;
        }
      }
      setPlayerImages((prev) => ({ ...prev, ...images }));
    };
    if (uniquePlayers.length > 0) {
      fetchImages();
    }
  }, [search, uniquePlayers]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-light mb-6 text-center text-gray-900 tracking-tight">
          THE <span className="font-semibold text-blue-600">PITCH</span> SHEET
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
            const { teamName, teamLogo } = getTeamInfo(player);

            return (
              <div key={player} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Player Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
                  <div className="flex items-center justify-center space-x-4">
                    {/* Player Image */}
                    {playerImages[player] && (
                      <div className="w-16 h-16 relative rounded-full overflow-hidden">
                        <Image
                          src={playerImages[player]}
                          alt={formatPlayerName(player)}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}

                    <div className="flex flex-col items-center">
                      <div className="flex items-center">
                        {/* Team Logo */}
                        {teamLogo && (
                          <div className="mr-3 w-8 h-8 relative">
                            <Image 
                              src={teamLogo} 
                              alt={teamName}
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        )}
                        {/* Player Name */}
                        <h2 className="text-xl md:text-2xl font-medium text-center">
                          {formatPlayerName(player)}
                        </h2>
                      </div>

                      {/* Team and Player Details */}
                      <div className="flex items-center mt-1">
                        <span className="text-sm font-light opacity-90 mr-3">
                          {teamName}
                        </span>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                          {throwHand}HP • {armAngle}° slot
                        </span>
                      </div>
                    </div>
                  </div>
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
