'use client';

import { useEffect, useState, useMemo, Suspense, lazy } from 'react';
import data from '@/public/pitchers-5-4-25.json';
import pitcherIds from '@/public/pitcher_ids.json';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import { usePlayerData } from './usePlayerData';


const inter = Inter({ subsets: ['latin'] });
const PlayerCard = lazy(() => import('./PlayerCard'));

interface PitchData {
  player_name: string;
  team_name: string;
  team_logo?: string;
  pitch_type: string;
  stand_side: 'R' | 'L';
  throws: string;
  arm_angle: number | string;
  velocity_range: string;
  usage_rate: string;
  zone_rate: string;
  avg_horz_break?: number;
  avg_induced_vert_break?: number;
  avg_spin_rate?: number;
}

interface PitcherId {
  player_name: string;
  player_id?: number;
}

interface HeatMapData {
  [pitchType: string]: {
    R: string;
    L: string;
  };
}

interface TeamInfo {
  teamName: string;
  teamLogo: string;
}

// Team divisions data
const MLB_DIVISIONS: Record<string, string[]> = {
  'AL West': [
    'Houston Astros',
    'Sugar Land Space Cowboys',
    'Los Angeles Angels',
    'Salt Lake Bees',
    'Athletics',
    'Las Vegas Aviators',
    'Seattle Mariners',
    'Tacoma Rainiers',
    'Texas Rangers',
    'Round Rock Express'
  ],
  'AL Central': [
    'Chicago White Sox',
    'Charlotte Knights',
    'Cleveland Guardians',
    'Columbus Clippers',
    'Detroit Tigers',
    'Toledo Mud Hens',
    'Kansas City Royals',
    'Omaha Storm Chasers',
    'Minnesota Twins',
    'St. Paul Saints'
  ],
  'AL East': [
    'Baltimore Orioles',
    'Norfolk Tides',
    'Boston Red Sox',
    'Worcester Red Sox',
    'New York Yankees',
    'Scranton/Wilkes-Barre RailRiders',
    'Tampa Bay Rays',
    'Durham Bulls',
    'Toronto Blue Jays',
    'Buffalo Bisons'
  ],
  'NL West': [
    'Arizona Diamondbacks',
    'Reno Aces',
    'Colorado Rockies',
    'Albuquerque Isotopes',
    'Los Angeles Dodgers',
    'Oklahoma City Dodgers',
    'San Diego Padres',
    'El Paso Chihuahuas',
    'San Francisco Giants',
    'Sacramento River Cats'
  ],
  'NL Central': [
    'Chicago Cubs',
    'Iowa Cubs',
    'Cincinnati Reds',
    'Louisville Bats',
    'Milwaukee Brewers',
    'Nashville Sounds',
    'Pittsburgh Pirates',
    'Indianapolis Indians',
    'St. Louis Cardinals',
    'Memphis Redbirds'
  ],
  'NL East': [
    'Atlanta Braves',
    'Gwinnett Stripers',
    'Miami Marlins',
    'Jacksonville Jumbo Shrimp',
    'New York Mets',
    'Syracuse Mets',
    'Philadelphia Phillies',
    'Lehigh Valley IronPigs',
    'Washington Nationals',
    'Rochester Red Wings'
  ]
};


// Cache helper
const cache = new Map();
const cachedFetch = async <T,>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  if (cache.has(key)) return cache.get(key);
  const data = await fetcher();
  cache.set(key, data);
  return data;
};

// Helpers
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

const getPlayerImage = async (playerName: string): Promise<string> => {
  const player = pitcherIds.find(p => p.player_name.toLowerCase() === playerName.toLowerCase());
  return player?.player_id
    ? `https://img.mlbstatic.com/mlb-photos/image/upload/w_180,q_100/v1/people/${player.player_id}/headshot/67/current.jpg`
    : '/default_player.png';
};

const getTeamInfo = async (playerName: string): Promise<TeamInfo> => {
  const player = pitcherIds.find(p => p.player_name.toLowerCase() === playerName.toLowerCase());
  if (!player?.player_id) return { teamName: 'Unknown', teamLogo: '' };
  try {
    const res = await fetch(`https://statsapi.mlb.com/api/v1/people/${player.player_id}?hydrate=currentTeam`);
    const json = await res.json();
    const team = json.people[0]?.currentTeam;
    return team
      ? { teamName: team.name, teamLogo: `https://www.mlbstatic.com/team-logos/${team.id}.svg` }
      : { teamName: 'Unknown', teamLogo: '' };
  } catch {
    return { teamName: 'Unknown', teamLogo: '' };
  }
};

const fetchHeatMaps = async (playerName: string): Promise<HeatMapData> => {
  const safeName = playerName.replace(/\s+/g, '_').replace(/,/g, '');
  const playerData = data.filter(p => p.player_name === playerName);
  const heatMaps: HeatMapData = {};
  playerData.forEach(p => {
    if (!heatMaps[p.pitch_type]) heatMaps[p.pitch_type] = { R: '', L: '' };
    heatMaps[p.pitch_type][p.stand_side as 'R' | 'L'] = `/heatmaps/${safeName}_${p.pitch_type}_${p.stand_side}.png`;

  });
  return heatMaps;
};


// Team Filter Component
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

// Main Page
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
            <Suspense fallback={
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            }>
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
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
