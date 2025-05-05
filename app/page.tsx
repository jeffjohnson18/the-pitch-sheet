'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import data from '@/public/pitchers-5-4-25.json';
import pitcherIds from '@/public/pitcher_ids.json';
import Image from 'next/image';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const PlayerCard = dynamic(() => import('./PlayerCard'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
});

const MLB_DIVISIONS: Record<string, string[]> = {
  'AL West': ['Houston Astros', 'Sugar Land Space Cowboys', 'Los Angeles Angels', 'Salt Lake Bees', 'Athletics', 'Las Vegas Aviators', 'Seattle Mariners', 'Tacoma Rainiers', 'Texas Rangers', 'Round Rock Express'],
  'AL Central': ['Chicago White Sox', 'Charlotte Knights', 'Cleveland Guardians', 'Columbus Clippers', 'Detroit Tigers', 'Toledo Mud Hens', 'Kansas City Royals', 'Omaha Storm Chasers', 'Minnesota Twins', 'St. Paul Saints'],
  'AL East': ['Baltimore Orioles', 'Norfolk Tides', 'Boston Red Sox', 'Worcester Red Sox', 'New York Yankees', 'Scranton/Wilkes-Barre RailRiders', 'Tampa Bay Rays', 'Durham Bulls', 'Toronto Blue Jays', 'Buffalo Bisons'],
  'NL West': ['Arizona Diamondbacks', 'Reno Aces', 'Colorado Rockies', 'Albuquerque Isotopes', 'Los Angeles Dodgers', 'Oklahoma City Dodgers', 'San Diego Padres', 'El Paso Chihuahuas', 'San Francisco Giants', 'Sacramento River Cats'],
  'NL Central': ['Chicago Cubs', 'Iowa Cubs', 'Cincinnati Reds', 'Louisville Bats', 'Milwaukee Brewers', 'Nashville Sounds', 'Pittsburgh Pirates', 'Indianapolis Indians', 'St. Louis Cardinals', 'Memphis Redbirds'],
  'NL East': ['Atlanta Braves', 'Gwinnett Stripers', 'Miami Marlins', 'Jacksonville Jumbo Shrimp', 'New York Mets', 'Syracuse Mets', 'Philadelphia Phillies', 'Lehigh Valley IronPigs', 'Washington Nationals', 'Rochester Red Wings']
};

const formatPlayerName = (name: string) =>
  name.includes(',') ? name.split(',').map(p => p.trim()).reverse().join(' ') : name;

const getThrowHand = (playerName: string) =>
  data.find(p => p.player_name === playerName)?.throws || 'R';

const getArmAngle = (playerName: string) => {
  const angles = data
    .filter(p => p.player_name === playerName)
    .map(p => typeof p.arm_angle === 'number' ? p.arm_angle : parseFloat(p.arm_angle))
    .filter(v => !isNaN(v));
  return angles.length ? (angles.reduce((a, b) => a + b) / angles.length).toFixed(1) : '0.0';
};

// Team filter UI
const TeamFilterSection = ({
  teams, selectedTeams, setSelectedTeams
}: {
  teams: { name: string; logo: string }[];
  selectedTeams: string[];
  setSelectedTeams: (teams: string[]) => void;
}) => {
  const teamsByDivision: Record<string, typeof teams> = {};

  teams.forEach(team => {
    let division = 'Non-MLB';
    for (const [div, teamNames] of Object.entries(MLB_DIVISIONS)) {
      if (teamNames.includes(team.name)) {
        division = div;
        break;
      }
    }
    if (!teamsByDivision[division]) teamsByDivision[division] = [];
    teamsByDivision[division].push(team);
  });

  const sortedDivisions = Object.entries(teamsByDivision).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-6">
      {sortedDivisions.map(([division, divisionTeams]) => (
        <div key={division}>
          <h3 className="font-medium text-lg mb-2">{division}</h3>
          <div className="flex flex-wrap gap-3">
            {divisionTeams.map(team => (
              <label key={team.name} className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedTeams.includes(team.name)}
                  onChange={() =>
                    setSelectedTeams(
                      selectedTeams.includes(team.name)
                        ? selectedTeams.filter(t => t !== team.name)
                        : [...selectedTeams, team.name]
                    )
                  }
                />
                {team.logo && (
                  <Image src={team.logo} alt={team.name} width={24} height={24} className="object-contain" />
                )}
                <span className="text-sm">{team.name}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Page() {
  const [search, setSearch] = useState('');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [showTeams, setShowTeams] = useState(false);

  const pitchNameMap = useMemo(() => ({
    FF: 'Four-Seam Fastball', SL: 'Slider', CH: 'Changeup', CU: 'Curveball',
    SI: 'Sinker', FC: 'Cutter', KC: 'Knuckle Curve', FS: 'Splitter',
    KN: 'Knuckleball', EP: 'Eephus', SC: 'Screwball', ST: 'Sweeper'
  }), []);

  const filteredData = useMemo(() =>
    data.filter(p =>
      p.player_name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedTeams.length === 0 || selectedTeams.includes(p.team_name))
    ), [search, selectedTeams]);

  const uniquePlayers = useMemo(() =>
    Array.from(new Set(filteredData.map(p => p.player_name))), [filteredData]);

  const uniqueTeams = useMemo(() =>
    Array.from(new Set(data.map(p => p.team_name)))
      .map(teamName => ({
        name: teamName,
        logo: data.find(p => p.team_name === teamName)?.team_logo || ''
      })), []);

  return (
    <div className={`min-h-screen bg-gray-50 p-4 md:p-8 ${inter.className}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          THE <span className="text-blue-600">PITCH</span> SHEET
        </h1>

        <div className="mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for a pitcher..."
            className="w-full p-3 rounded-lg border border-gray-300 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="text-center mb-6">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
            onClick={() => setShowTeams(!showTeams)}
          >
            {showTeams ? 'Hide Team Filter' : 'Filter by Team'}
          </button>
        </div>

        {showTeams && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <TeamFilterSection
              teams={uniqueTeams}
              selectedTeams={selectedTeams}
              setSelectedTeams={setSelectedTeams}
            />
          </div>
        )}

        {uniquePlayers.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-lg">
            No pitchers found matching your criteria
          </div>
        ) : (
          <div className="space-y-8">
            {uniquePlayers.map(player => (
              <PlayerCard
                key={player}
                player={player}
                data={filteredData.filter(p => p.player_name === player)}
                pitchNameMap={pitchNameMap}
                formatPlayerName={formatPlayerName}
                getThrowHand={getThrowHand}
                getArmAngle={getArmAngle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
