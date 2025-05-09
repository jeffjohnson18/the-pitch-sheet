'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import data from '@/public/pitchers-5-4-25.json';
import pitcherIds from '@/public/pitcher_ids.json';
import { Analytics } from "@vercel/analytics/react"
import Image from 'next/image';
import { Inter } from 'next/font/google';
import Sidebar from './components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

interface PitcherData {
  id: number;
  player_name: string;
  player_image: string;
  team_name: string;
  team_logo: string;
  stand_side: string;
  pitch_type: string;
  velocity_range: string;
  usage_rate: string;
  zone_rate: string;
  avg_spin_rate: number;
  avg_horz_break: number;
  avg_induced_vert_break: number;
  heatmap_path: string;
}

interface PitcherIds {
  [key: string]: string;
}

const typedPitcherIds: PitcherIds = Object.fromEntries(
  data.map(p => [p.player_name, p.player_name])
);

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
  const [visibleCount, setVisibleCount] = useState(50);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    // Check for existing token in localStorage
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      fetchFavorites(token);
    }
  }, []);

  // Listen for storage events to update token when it changes
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        setAccessToken(token);
        fetchFavorites(token);
      } else {
        setAccessToken('');
        setFavorites([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchFavorites = async (token: string) => {
    try {
      console.log('Fetching favorites with token:', token);
      const response = await fetch('https://moundreport-02d207132db6.herokuapp.com/api/favorites/get_all_favorites/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched favorites:', data);
        setFavorites(data.map((fav: any) => fav.pitcher_name));
      } else {
        console.error('Failed to fetch favorites:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const getPitcherId = (playerName: string) => {
    console.log('Getting pitcher name for:', playerName);
    return playerName;
  };

  const handleFavorite = async (playerName: string) => {
    // If playerName is empty, it means we're refreshing the favorites list
    if (!playerName) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetchFavorites(token);
      }
      return;
    }

    const token = localStorage.getItem('accessToken');
    console.log('Handling favorite for pitcher:', playerName, 'with token:', token);
    
    if (!token) {
      alert('Please login to add favorites');
      return;
    }

    // Only proceed if the player is not already favorited
    if (!favorites.includes(playerName)) {
      try {
        console.log('Adding favorite:', playerName);
        // Add to favorites
        const response = await fetch('https://moundreport-02d207132db6.herokuapp.com/api/favorites', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pitcher_name: playerName
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to add favorite:', errorData);
          throw new Error(errorData.detail || 'Failed to add favorite');
        }
        
        console.log('Successfully added favorite');
        setFavorites([...favorites, playerName]);
      } catch (error) {
        console.error('Error updating favorites:', error);
        alert(error instanceof Error ? error.message : 'Failed to update favorites. Please try again.');
      }
    }
  };

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

  const visiblePlayers = useMemo(() =>
    uniquePlayers.slice(0, visibleCount), [uniquePlayers, visibleCount]);

  const uniqueTeams = useMemo(() =>
    Array.from(new Set(data.map(p => p.team_name)))
      .map(teamName => ({
        name: teamName,
        logo: data.find(p => p.team_name === teamName)?.team_logo || ''
      })), []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 50);
  };

  return (
    <div className={`min-h-screen bg-gray-50 p-4 md:p-8 ${inter.className}`}>
      <div className="max-w-7xl mx-auto pr-80">
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center mb-6 w-full">
            <h1 className="text-4xl font-bold text-gray-800">
              THE <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">MOUND</span> REPORT
            </h1>
          </div>

          <div className="mb-8 max-w-2xl w-full">
            <input
              type="text"
              placeholder="Search for a pitcher..."
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 placeholder:text-transparent placeholder:bg-clip-text placeholder:bg-gradient-to-r placeholder:from-blue-600 placeholder:to-purple-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 font-medium hover:opacity-80 transition-opacity"
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

        {visiblePlayers.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-lg">
            No pitchers found matching your criteria
          </div>
        ) : (
          <>
            <div className="space-y-8 max-w-4xl mx-auto">
              {visiblePlayers.map(player => (
                <div key={player} className="relative" data-player={player}>
                  <button
                    onClick={() => handleFavorite(player)}
                    className="absolute top-4 left-4 z-10 text-2xl hover:text-blue-600 transition-colors duration-200"
                    title={favorites.includes(player) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {favorites.includes(player) ? '★' : '☆'}
                  </button>
                  <PlayerCard
                    player={player}
                    data={filteredData.filter(p => p.player_name === player)}
                    pitchNameMap={pitchNameMap}
                    formatPlayerName={formatPlayerName}
                    getThrowHand={getThrowHand}
                    getArmAngle={getArmAngle}
                  />
                </div>
              ))}
            </div>
            {visibleCount < uniquePlayers.length && (
              <div className="text-center mt-10">
                <button
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                  onClick={handleLoadMore}
                >
                  Load More Pitchers
                </button>
              </div>
            )}
          </>
        )}

        <Sidebar
          onFavorite={handleFavorite}
          favorites={favorites}
        />
      </div>
    </div>
  );
}
