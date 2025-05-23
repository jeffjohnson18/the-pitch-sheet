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

    const renderTable = (pitches: any[], label: string) => (
        <div className="p-4">
            <h3 className="font-medium text-xs text-blue-600 mb-3 text-center tracking-wider">{label}</h3>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="text-left text-[10px] text-gray-500 uppercase tracking-wider">
                            <th className="pb-2 border-b border-gray-100 text-gray-800 font-medium">Pitch</th>
                            <th className="pb-2 border-b border-gray-100 text-gray-800 text-right font-medium">Velo</th>
                            <th className="pb-2 border-b border-gray-100 text-gray-800 text-right font-medium">Usage</th>
                            <th className="pb-2 border-b border-gray-100 text-gray-800 text-right font-medium">Zone%</th>
                            <th className="pb-2 border-b border-gray-100 text-gray-800 text-right font-medium">Spin</th>
                            <th className="pb-2 border-b border-gray-100 text-gray-800 text-right font-medium">Horizontal Break</th>
                            <th className="pb-2 border-b border-gray-100 text-gray-800 text-right font-medium">Vertical Break</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pitches.map((pitch, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="py-2 border-b border-gray-100 text-xs font-medium text-gray-800">{pitchNameMap[pitch.pitch_type] || pitch.pitch_type}</td>
                                <td className="py-2 border-b border-gray-100 text-xs text-right text-gray-800">{pitch.velocity_range}</td>
                                <td className="py-2 border-b border-gray-100 text-xs text-right text-gray-800">{pitch.usage_rate}</td>
                                <td className="py-2 border-b border-gray-100 text-xs text-right text-gray-800">{pitch.zone_rate}</td>
                                <td className="py-2 border-b border-gray-100 text-xs text-right text-gray-800">{pitch.avg_spin_rate}</td>
                                <td className="py-2 border-b border-gray-100 text-xs text-right text-gray-800">{pitch.avg_horz_break}</td>
                                <td className="py-2 border-b border-gray-100 text-xs text-right text-gray-800">{pitch.avg_induced_vert_break}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className={`bg-white rounded-xl shadow overflow-hidden max-w-5xl mx-auto ${inter.className}`}>
            {/* Header */}
            <div className="p-6 text-white" style={{ background: `linear-gradient(135deg, ${teamColors.primary} 0%, ${teamColors.secondary} 100%)` }}>
                <div className="flex items-center justify-center">
                    {playerData?.image && (
                        <div className="w-20 h-20 relative rounded-full overflow-hidden mr-4">
                            <Image
                                src={playerData.image}
                                alt={formatPlayerName(player)}
                                width={80}
                                height={80}
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
                        </div>
                    )}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center -ml-6">
                            {teamInfo.teamLogo && (
                                <div className="w-8 h-8 relative mr-3">
                                    <Image
                                        src={teamInfo.teamLogo}
                                        alt={teamInfo.teamName}
                                        width={24}
                                        height={24}
                                        className="object-contain"
                                    />
                                </div>
                            )}
                            <h2 className="text-2xl font-medium">
                                {formatPlayerName(player)}
                            </h2>
                        </div>
                        <div className="flex items-center space-x-3 mt-2">
                            <span className="text-sm">{teamInfo.teamName}</span>
                            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                                {throwHand}HP • {armAngle}° slot
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data tables */}
            <div className="divide-y divide-gray-100">
                {renderTable(vsRight, 'VS RIGHT HANDED HITTERS')}
                {renderTable(vsLeft, 'VS LEFT HANDED HITTERS')}
            </div>

            {/* Heatmaps */}
            <div className="p-6">
                <h3 className="font-medium text-xs text-center text-blue-600 mb-4 tracking-wider">LOCATION HEATMAPS</h3>
                <div className="flex overflow-x-auto space-x-8 pb-4">
                    {vsRight.map((pitch, i) => (
                        <div key={i} className="flex flex-col items-center flex-shrink-0">
                            <h4 className="text-xs font-medium mb-2">
                                {pitchNameMap[pitch.pitch_type] || pitch.pitch_type}
                            </h4>
                            <div className="flex space-x-6">
                                <div className="text-center">
                                    <p className="text-[10px] text-gray-500 mb-1">VS R</p>
                                    {playerData?.heatMaps[pitch.pitch_type]?.R ? (
                                        <HeatmapImage
                                            src={playerData.heatMaps[pitch.pitch_type].R}
                                            alt={`${pitch.pitch_type} vs R`}
                                        />
                                    ) : (
                                        <div className="w-32 h-40 bg-gray-100 flex items-center justify-center text-xs">
                                            No pitching data
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-gray-500 mb-1">VS L</p>
                                    {playerData?.heatMaps[pitch.pitch_type]?.L ? (
                                        <HeatmapImage
                                            src={playerData.heatMaps[pitch.pitch_type].L}
                                            alt={`${pitch.pitch_type} vs L`}
                                        />
                                    ) : (
                                        <div className="w-32 h-40 bg-gray-100 flex items-center justify-center text-xs">
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
