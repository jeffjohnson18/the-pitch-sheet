import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import data from '@/public/pitchers-5-4-25.json';
import pitcherIds from '@/public/pitcher_ids.json';

const inter = Inter({ subsets: ['latin'] });

interface SidebarProps {
  onFavorite: (playerName: string) => void;
  favorites: string[];
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

export default function Sidebar({ onFavorite, favorites }: SidebarProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check for existing token in localStorage
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
      // Get username from token payload
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.user_id) {
          setUsername(`User ${payload.user_id}`);
        }
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  // Get unique pitcher data for favorites
  const favoritePitchers = favorites.map(playerName => ({
    player_name: playerName
  }));

  useEffect(() => {
    console.log('Sidebar favorites updated:', favorites);
  }, [favorites]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/token/' : '/api/users/';
    const payload = isLogin
      ? { username, password }
      : { username, email, password };

    try {
      const response = await fetch(`https://moundreport-02d207132db6.herokuapp.com${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      if (isLogin) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setAccessToken(data.access);
        setIsAuthenticated(true);
        // Trigger a storage event to notify other components
        window.dispatchEvent(new Event('storage'));
        // Fetch favorites immediately after login
        onFavorite(''); // This will trigger a refresh of the favorites list
      } else {
        setIsLogin(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken('');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    // Trigger a storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  };

  const formatPlayerName = (name: string) =>
    name.includes(',') ? name.split(',').map(p => p.trim()).reverse().join(' ') : name;

  const scrollToPlayer = (playerName: string) => {
    const element = document.querySelector(`[data-player="${playerName}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleClearAll = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please login to manage favorites');
      return;
    }

    try {
      const response = await fetch('https://moundreport-02d207132db6.herokuapp.com/api/favorites/clear_all/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to clear favorites');
      }

      // Clear the favorites list
      onFavorite(''); // This will trigger a refresh of the favorites list
    } catch (error) {
      console.error('Error clearing favorites:', error);
      alert(error instanceof Error ? error.message : 'Failed to clear favorites. Please try again.');
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                {favoritePitchers.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {favoritePitchers.map((pitcher) => (
                  <div
                    key={pitcher.player_name}
                    className="flex items-center p-2 hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    <button
                      onClick={() => scrollToPlayer(pitcher.player_name)}
                      className="text-gray-800 hover:text-blue-600 transition-colors duration-200 text-left flex-grow"
                    >
                      {formatPlayerName(pitcher.player_name)}
                    </button>
                  </div>
                ))}
                {favoritePitchers.length === 0 && (
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