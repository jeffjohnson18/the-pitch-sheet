import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import data from '@/public/pitchers-5-4-25.json';
import pitcherIds from '@/public/pitcher_ids.json';

const inter = Inter({ subsets: ['latin'] });

interface SidebarProps {
  onFavorite: (playerName: string) => void;
  favorites: string[];
  username: string;
  accessToken: string;
  isAuthenticated: boolean;
  onAuth: (token: string, userInfo: { username: string }) => void;
  onLogout: () => void;
}

interface PitcherData {
  player_name: string;
}

interface PitcherIds {
  [key: string]: string;
}

const typedPitcherIds: PitcherIds = Object.fromEntries(
  data.map(p => [p.player_name, p.player_name])
);

export default function Sidebar({ 
  onFavorite, 
  favorites, 
  username, 
  accessToken,
  isAuthenticated,
  onAuth,
  onLogout 
}: SidebarProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [inputUsername, setInputUsername] = useState('');
  const [sidebarFavorites, setSidebarFavorites] = useState<string[]>([]);
  const router = useRouter();

  const fetchFavorites = async () => {
    if (!accessToken || !username) {
      console.log('Skipping fetchFavorites in Sidebar:', { accessToken, username });
      return;
    }

    try {
      console.log('=== Fetching Favorites in Sidebar ===');
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
      
      console.log('=== Response Details in Sidebar ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('Response Body:', data);
      
      if (response.ok) {
        const newFavorites = data.map((fav: any) => fav.pitcher.player_name);
        console.log('Processed Favorites in Sidebar:', newFavorites);
        setSidebarFavorites(newFavorites);
      } else {
        console.error('=== Error Response in Sidebar ===');
        console.error('Status:', response.status);
        console.error('Error Data:', data);
      }
    } catch (error) {
      console.error('=== Fetch Error in Sidebar ===');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && accessToken && username) {
      console.log('=== Sidebar Auth State Changed ===');
      console.log('Fetching favorites for user:', username);
      fetchFavorites();
    } else {
      setSidebarFavorites([]);
    }
  }, [isAuthenticated, accessToken, username]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('=== Authentication Request ===');
    console.log('Mode:', isLogin ? 'Login' : 'Register');
    console.log('Username:', inputUsername);
    if (!isLogin) {
      console.log('Email:', email);
    }

    const endpoint = isLogin ? '/api/token/' : '/api/users/';
    const payload = isLogin
      ? { username: inputUsername, password }
      : { username: inputUsername, email, password };

    console.log('Request URL:', `https://moundreport-02d207132db6.herokuapp.com${endpoint}`);
    console.log('Request Payload:', { ...payload, password: '***' });

    try {
      const response = await fetch(`https://moundreport-02d207132db6.herokuapp.com${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('=== Response Details ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Response Body:', data);

      if (!response.ok) {
        console.error('=== Authentication Error ===');
        console.error('Error Data:', data);
        throw new Error(data.detail || 'Authentication failed');
      }

      if (isLogin) {
        console.log('=== Login Success ===');
        console.log('Token received');
        
        // Get user info after successful login
        const userInfoResponse = await fetch('https://moundreport-02d207132db6.herokuapp.com/api/user/info/', {
          headers: {
            'Authorization': `Bearer ${data.access}`
          }
        });

        if (!userInfoResponse.ok) {
          throw new Error('Failed to get user info');
        }

        const userInfo = await userInfoResponse.json();
        console.log('=== User Info ===');
        console.log('User Info:', userInfo);

        // Clear existing favorites before setting new token
        onFavorite(''); // This will trigger a refresh of the favorites list
        onAuth(data.access, userInfo);
      } else {
        console.log('=== Registration Success ===');
        setIsLogin(true);
      }
    } catch (err) {
      console.error('=== Authentication Error ===');
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleClearAll = async () => {
    console.log('=== Clearing All Favorites ===');
    if (!accessToken || !username) {
      console.log('No token found, requesting login');
      alert('Please login to manage favorites');
      return;
    }

    try {
      const requestBody = {
        pitcher_names: []
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

      console.log('=== Response Details ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json();
        console.error('=== Clear All Error ===');
        console.error('Error Data:', errorData);
        throw new Error(errorData.detail || 'Failed to clear favorites');
      }

      const data = await response.json();
      console.log('=== Clear All Success ===');
      console.log('Response:', data);
      
      // Clear the favorites list and refresh immediately
      setSidebarFavorites([]);
      await fetchFavorites();
    } catch (error) {
      console.error('=== Clear All Error ===');
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to clear favorites. Please try again.');
    }
  };

  // Add a useEffect to refresh favorites when they change
  useEffect(() => {
    if (isAuthenticated && accessToken && username) {
      fetchFavorites();
    }
  }, [favorites]); // This will trigger when favorites change in the parent component

  const handleLogout = async () => {
    console.log('=== Starting Logout Process ===');
    console.log('Current state:', {
      isAuthenticated,
      username,
      accessToken: accessToken ? 'Token exists' : 'No token',
      favoritesCount: favorites.length
    });

    // Save current favorites before logout
    if (accessToken && favorites.length > 0) {
      try {
        console.log('=== Saving Favorites Before Logout ===');
        console.log('Favorites to save:', favorites);
        console.log('Request URL:', `https://moundreport-02d207132db6.herokuapp.com/api/favorites/save_favorites/?username=${username}`);
        console.log('Request headers:', {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        });

        const response = await fetch(`https://moundreport-02d207132db6.herokuapp.com/api/favorites/save_favorites/?username=${username}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pitcher_names: favorites
          })
        });

        console.log('=== Save Response ===');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          console.error('Failed to save favorites before logout');
          const errorData = await response.json();
          console.error('Error Data:', errorData);
        } else {
          const data = await response.json();
          console.log('Successfully saved favorites before logout');
          console.log('Response:', data);
        }
      } catch (error) {
        console.error('=== Save Error During Logout ===');
        console.error('Error:', error);
      }
    }

    onLogout();
  };

  const formatPlayerName = (name: string) =>
    name.includes(',') ? name.split(',').map(p => p.trim()).reverse().join(' ') : name;

  const scrollToPlayer = (playerName: string) => {
    const element = document.querySelector(`[data-player="${playerName}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-gray-50 shadow-lg ${inter.className}`}>
      <div className="p-6 h-full overflow-y-auto">
        {!isAuthenticated ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              {isLogin ? 'Login' : 'Register'}
            </h2>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Username
                </label>
                <input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                  required
                />
              </div>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-800">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                  required
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
              >
                {isLogin ? 'Login' : 'Register'}
              </button>
            </form>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                {username}
              </h2>
              <button
                onClick={handleLogout}
                className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white py-1 px-3 rounded-md hover:opacity-90 transition-opacity"
              >
                Logout
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Favorites</h3>
                {sidebarFavorites.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {sidebarFavorites.map((pitcher) => (
                  <div
                    key={pitcher}
                    className="flex items-center p-2 hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    <button
                      onClick={() => scrollToPlayer(pitcher)}
                      className="text-gray-800 hover:text-blue-600 transition-colors duration-200 text-left flex-grow"
                    >
                      {formatPlayerName(pitcher)}
                    </button>
                  </div>
                ))}
                {sidebarFavorites.length === 0 && (
                  <p className="text-gray-500 text-sm">No favorites yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 