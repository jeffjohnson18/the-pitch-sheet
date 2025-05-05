'use client';

import { usePlayerData } from './usePlayerData';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

interface PlayerCardProps {
    player: string;
    data: any[];
    pitchNameMap: Record<string, string>;
    formatPlayerName: (name: string) => string;
    getThrowHand: (name: string) => string;
    getArmAngle: (name: string) => string;
}

const HeatmapImage = ({ src, alt }: { src: string; alt: string }) => {
    const [ref, inView] = useInView({ triggerOnce: true });
    return (
      <div ref={ref} className="w-32 h-40 relative">
        {inView && src ? (
          <Image src={src} alt={alt} fill className="object-contain" />
        ) : (
          <div className="w-32 h-40 bg-gray-100 flex items-center justify-center">
            No image available
          </div>
        )}
      </div>
    );
  };
  

const TEAM_COLORS: { [key: string]: { primary: string; secondary: string } } = {
    'Arizona Diamondbacks': { primary: '#A71930', secondary: '#E3D4AD' },
    'Atlanta Braves': { primary: '#13274F', secondary: '#CE1141' },
    'Baltimore Orioles': { primary: '#DF4601', secondary: '#000000' },
    'Boston Red Sox': { primary: '#BD3039', secondary: '#0C2340' },
    'Chicago Cubs': { primary: '#0E3386', secondary: '#CC3433' },
    'Chicago White Sox': { primary: '#27251F', secondary: '#C4CED4' },
    'Cincinnati Reds': { primary: '#C6011F', secondary: '#000000' },
    'Cleveland Guardians': { primary: '#0C2340', secondary: '#E31937' },
    'Colorado Rockies': { primary: '#33006F', secondary: '#C4CED4' },
    'Detroit Tigers': { primary: '#0C2340', secondary: '#FA4616' },
    'Houston Astros': { primary: '#002D62', secondary: '#EB6E1F' },
    'Kansas City Royals': { primary: '#004687', secondary: '#BD9B60' },
    'Los Angeles Angels': { primary: '#003263', secondary: '#BA0021' },
    'Los Angeles Dodgers': { primary: '#005A9C', secondary: '#A5ACAF' },
    'Miami Marlins': { primary: '#00A3E0', secondary: '#EF3340' },
    'Milwaukee Brewers': { primary: '#12284B', secondary: '#FFC52F' },
    'Minnesota Twins': { primary: '#002B5C', secondary: '#D31145' },
    'New York Mets': { primary: '#002D72', secondary: '#FF5910' },
    'New York Yankees': { primary: '#0C2340', secondary: '#C4CED4' },
    'Athletics': { primary: '#003831', secondary: '#EFB21E' },
    'Philadelphia Phillies': { primary: '#E81828', secondary: '#002D72' },
    'Pittsburgh Pirates': { primary: '#FDB827', secondary: '#27251F' },
    'San Diego Padres': { primary: '#2F241D', secondary: '#FFC425' },
    'San Francisco Giants': { primary: '#FD5A1E', secondary: '#27251F' },
    'Seattle Mariners': { primary: '#0C2C56', secondary: '#005C5C' },
    'St. Louis Cardinals': { primary: '#C41E3A', secondary: '#0C2340' },
    'Tampa Bay Rays': { primary: '#092C5C', secondary: '#8FBCE6' },
    'Texas Rangers': { primary: '#003278', secondary: '#C0111F' },
    'Toronto Blue Jays': { primary: '#134A8E', secondary: '#E8291C' },
    'Washington Nationals': { primary: '#AB0003', secondary: '#14225A' },
    'Unknown Team': { primary: '#1E3A8A', secondary: '#3B82F6' }
};

export default function PlayerCard({
    player,
    data,
    pitchNameMap,
    formatPlayerName,
    getThrowHand,
    getArmAngle
}: PlayerCardProps) {
    const { data: playerData, loading } = usePlayerData(player);

    if (loading) {
        return <div className={`bg-white p-4 rounded-lg shadow animate-pulse ${inter.className}`}>Loading...</div>;
    }

    const vsRight = data.filter(p => p.stand_side === 'R');
    const vsLeft = data.filter(p => p.stand_side === 'L');
    const throwHand = getThrowHand(player);
    const armAngle = getArmAngle(player);

    const teamInfo = playerData?.teamInfo || { teamName: 'Unknown Team', teamLogo: '' };
    const teamColors = TEAM_COLORS[teamInfo.teamName] || TEAM_COLORS['Unknown Team'];

    return (
        <div className={`bg-white rounded-xl shadow overflow-hidden ${inter.className}`}>
            {/* Player header with team colors */}
            {/* Player header with team colors */}
            <div
                className="p-4 text-white"
                style={{
                    background: `linear-gradient(135deg, ${teamColors.primary} 0%, ${teamColors.secondary} 100%)`
                }}
            >
                <div className="flex items-center justify-center">
                    {/* Player headshot */}
                    {playerData?.image ? (
  <Image
    src={playerData.image}
    alt={formatPlayerName(player)}
    width={64}
    height={64}
    className="object-scale-down"
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      minWidth: '100%',
      minHeight: '100%',
      width: 'auto',
      height: 'auto'
    }}
  />
) : (
  <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
    No Image
  </div>
)}


                    {/* Name and info */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center -ml-6"> {/* Negative margin to compensate for logo */}
                            {teamInfo.teamLogo && (
                                <div className="w-6 h-6 relative mr-2"> {/* Logo container */}
                                    <Image
                                        src={teamInfo.teamLogo}
                                        alt={teamInfo.teamName}
                                        width={18}
                                        height={18}
                                        className="object-contain"
                                    />
                                </div>
                            )}
                            <h2 className="text-xl font-medium">
                                {formatPlayerName(player)}
                            </h2>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                            <span>{teamInfo.teamName}</span>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                {throwHand}HP • {armAngle}° slot
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data tables with fixed sizing */}
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="p-4">
                    <h3 className="font-medium text-blue-600 text-sm text-center mb-3 tracking-wider">VS RIGHT HANDED HITTERS</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                                    <th className="pb-2 border-b border-gray-100 text-gray-800 font-medium w-1/4">PITCH</th>
                                    <th className="pb-2 border-b border-gray-100 text-gray-800 text-right font-medium w-1/4">VELO</th>
                                    <th className="pb-2 border-b border-gray-100 text-gray-800 text-right font-medium w-1/4">USAGE</th>
                                    <th className="pb-2 border-b border-gray-100 text-gray-800 text-right font-medium w-1/4">ZONE%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vsRight.map((pitch, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="py-2 border-b border-gray-100 text-gray-800 text-sm font-medium w-1/4">{pitchNameMap[pitch.pitch_type] || pitch.pitch_type}</td>
                                        <td className="py-2 border-b border-gray-100 text-gray-800 text-right text-sm font-medium w-1/4">{pitch.velocity_range}</td>
                                        <td className="py-2 border-b border-gray-100 text-gray-800 text-right text-sm font-medium w-1/4">{pitch.usage_rate}</td>
                                        <td className="py-2 border-b border-gray-100 text-gray-800 text-right text-sm font-medium w-1/4">{pitch.zone_rate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="font-medium text-sm text-blue-600 mb-3 text-center tracking-wider">VS LEFT HANDED HITTERS </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                                    <th className="pb-2 border-b border-gray-100 font-medium w-1/4">PITCH</th>
                                    <th className="pb-2 border-b border-gray-100 text-right font-medium w-1/4">VELO</th>
                                    <th className="pb-2 border-b border-gray-100 text-right font-medium w-1/4">USAGE</th>
                                    <th className="pb-2 border-b border-gray-100 text-right font-medium w-1/4">ZONE%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vsLeft.map((pitch, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="py-2 border-b border-gray-100 text-sm font-medium w-1/4">{pitchNameMap[pitch.pitch_type] || pitch.pitch_type}</td>
                                        <td className="py-2 border-b border-gray-100 text-right text-sm font-medium w-1/4">{pitch.velocity_range}</td>
                                        <td className="py-2 border-b border-gray-100 text-right text-sm font-medium w-1/4">{pitch.usage_rate}</td>
                                        <td className="py-2 border-b border-gray-100 text-right text-sm font-medium w-1/4">{pitch.zone_rate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Heatmaps */}
            <div className="p-4 justify-center">
                <h3 className="font-medium text-sm text-center text-blue-600 mb-3 tracking-wider">LOCATION HEATMAPS</h3>
                <div className="flex overflow-x-auto space-x-6 pb-2">
                    {vsRight.map((pitch, i) => (
                        <div key={i} className="flex flex-col items-center flex-shrink-0">
                            <h4 className="text-sm font-medium mb-2">
                                {pitchNameMap[pitch.pitch_type] || pitch.pitch_type}
                            </h4>
                            <div className="flex space-x-4">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-1">VS R</p>
                                    {playerData?.heatMaps[pitch.pitch_type]?.R ? (
                                        <HeatmapImage
                                            src={playerData.heatMaps[pitch.pitch_type].R}
                                            alt={`${pitch.pitch_type} vs R`}
                                        />
                                    ) : (
                                        <div className="w-32 h-40 bg-gray-100 flex items-center justify-center">
                                            No pitching data
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-1">VS L</p>
                                    {playerData?.heatMaps[pitch.pitch_type]?.L ? (
                                        <HeatmapImage
                                            src={playerData.heatMaps[pitch.pitch_type].L}
                                            alt={`${pitch.pitch_type} vs L`}
                                        />
                                    ) : (
                                        <div className="w-32 h-40 bg-gray-100 flex items-center justify-center">
                                            No data
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}