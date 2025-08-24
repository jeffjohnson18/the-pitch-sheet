'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import data from '@/public/pitchers-8-23-25.json';
import { Analytics } from "@vercel/analytics/react"
import Image from 'next/image';
import { Inter } from 'next/font/google';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Link from 'next/link';

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

// Extract pitcher IDs from the player_image URLs
const typedPitcherIds: PitcherIds = Object.fromEntries(
  data.map(p => {
    // Extract ID from URL like: "https://img.mlbstatic.com/mlb-photos/image/upload/w_300,q_100/v1/people/579328/headshot/current"
    const match = p.player_image?.match(/\/people\/(\d+)\//);
    const playerId = match ? match[1] : p.player_name; // fallback to player name if no ID found
    return [p.player_name, playerId];
  })
);


const PlayerCard = dynamic(() => import('../PlayerCard'), {
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

export default function AppPage() {
  const [search, setSearch] = useState('');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [showTeams, setShowTeams] = useState(false);
  const [visibleCount, setVisibleCount] = useState(50);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Authentication and favorites state - commented out
  // const [favorites, setFavorites] = useState<string[]>([]);
  // const [accessToken, setAccessToken] = useState('');
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [username, setUsername] = useState('');
  const [showNewUserAlert, setShowNewUserAlert] = useState(true);

  // Authentication functions - commented out
  /*
  const handleAuth = (token: string, userInfo: { username: string }) => {
    console.log('=== Setting Auth State ===');
    console.log('Token:', token);
    console.log('User Info:', userInfo);
    setAccessToken(token);
    setIsAuthenticated(true);
    setUsername(userInfo.username);
    fetchFavorites();
  };

  const handleLogout = () => {
    console.log('=== Logging Out ===');
    setAccessToken('');
    setIsAuthenticated(false);
    setUsername('');
    setFavorites([]);
  };

  const fetchFavorites = async () => {
    if (!accessToken || !username) {
      console.log('Skipping fetchFavorites:', { accessToken, username });
      return;
    }

    try {
      console.log('=== Fetching Favorites ===');
      console.log('User:', username);
      console.log('Request URL:', `https://moundreport-02d207132db6.herokuapp.com/api/favorites/my_favorites/?username=${username}`);
      console.log('Request headers:', {
        'Authorization': `Bearer ${accessToken}`
      });

      const response = await fetch(`https://moundreport-02d207132db6.herokuapp.com/api/favorites/my_favorites/?username=${username}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      console.log('=== Response Details ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('Response Body:', data);
      
      if (response.ok) {
        const newFavorites = data.map((fav: any) => fav.pitcher.player_name);
        console.log('Processed Favorites:', newFavorites);
        setFavorites(newFavorites);
      } else {
        console.error('=== Error Response ===');
        console.error('Status:', response.status);
        console.error('Error Data:', data);
      }
    } catch (error) {
      console.error('=== Fetch Error ===');
      console.error('Error:', error);
    }
  };

  const handleFavorite = async (playerName: string) => {
    if (!playerName) {
      console.log('=== Refreshing Favorites ===');
      fetchFavorites();
      return;
    }

    console.log('=== Handling Favorite ===');
    console.log('Player:', playerName);
    
    if (!accessToken || !username) {
      console.log('No token found, requesting login');
      alert('Please login to add favorites');
      return;
    }

    try {
      const isFavorite = favorites.includes(playerName);
      console.log('Is favorite:', isFavorite);
      
      let newFavorites: string[];
      if (isFavorite) {
        console.log('Removing from favorites');
        newFavorites = favorites.filter(name => name !== playerName);
      } else {
        console.log('Adding new favorite');
        newFavorites = [...favorites, playerName];
      }

      console.log('=== Save Favorites Start ===');
      console.log('Current username:', username);
      console.log('Favorites to save:', newFavorites);

      const requestBody = {
        pitcher_names: newFavorites
      };

      console.log('Making save favorites request...');
      console.log('Request URL:', `https://moundreport-02d207132db6.herokuapp.com/api/favorites/save_favorites/?username=${username}`);
      console.log('Request headers:', {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      });
      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`https://moundreport-02d207132db6.herokuapp.com/api/favorites/save_favorites/?username=${username}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('=== Save Favorites Response ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Response Body:', data);

      if (!response.ok) {
        console.error('=== Save Favorites Error ===');
        console.error('Error Data:', data);
        throw new Error(data.detail || 'Failed to save favorites');
      }

      console.log('=== Save Favorites Success ===');
      console.log('Response:', data);
      
      // Fetch updated favorites immediately
      console.log('Fetching updated favorites...');
      fetchFavorites();
    } catch (error) {
      console.error('=== Favorite Error ===');
      console.error('Error:', error);
      alert('Failed to update favorites. Please try again.');
    }
  };
  */

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
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      <Navbar />
      <div className="pt-20 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center">
            

            <div className="mt-10 mb-8 w-full max-w-2xl px-4 md:px-0">
              <input
                type="text"
                placeholder="Search for a pitcher..."
                className="mt-10 w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 placeholder:text-transparent placeholder:bg-clip-text placeholder:bg-gradient-to-r placeholder:from-blue-600 placeholder:to-purple-600"
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
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-8 mx-4 md:mx-0">
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
              <div className="space-y-8 max-w-4xl mx-auto px-4 md:px-0">
                {visiblePlayers.map(player => (
                  <div key={player} className="relative" data-player={player}>
                    {/* Favorite button - Commented out
                    <button
                      onClick={() => handleFavorite(player)}
                      className="absolute top-4 left-4 z-10 text-2xl hover:text-blue-600 transition-colors duration-200"
                      title={favorites.includes(player) ? "Remove from favorites" : "Add to favorites"}
                    >
                      {favorites.includes(player) ? '★' : '☆'}
                    </button>
                    */}
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

          {/* Sidebar - Commented out login/favorites functionality
          <Sidebar
            onFavorite={handleFavorite}
            favorites={favorites}
            username={username}
            accessToken={accessToken}
            isAuthenticated={isAuthenticated}
            onAuth={handleAuth}
            onLogout={handleLogout}
          />
          */}
        </div>
      </div>

      {/* New User Alert */}
      {showNewUserAlert && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 transform transition-all duration-300 ease-in-out hover:scale-105">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  New user?
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Learn how to use The Mound Report at the{' '}
                  <Link href="/user-guide" className="text-blue-600 hover:text-blue-800 font-medium underline">
                    User Guide
                  </Link>{' '}
                  page.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowNewUserAlert(false)}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Dismiss
                  </button>
                  <Link
                    href="/user-guide"
                    className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full hover:opacity-90 transition-opacity"
                  >
                    View Guide
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
