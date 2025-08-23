// app/hooks/usePlayerData.ts
'use client';

import { useEffect, useState } from 'react';
import data from '@/public/pitchers-8-23-25.json';
import pitcherIds from '@/public/pitcher_ids.json';

interface TeamInfo {
  teamName: string;
  teamLogo: string;
}

interface HeatMapData {
  [pitchType: string]: {
    R: string;
    L: string;
  };
}

// Cache helper
const cache = new Map();
const cachedFetch = async <T,>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  if (cache.has(key)) return cache.get(key);
  const data = await fetcher();
  cache.set(key, data);
  return data;
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

export const usePlayerData = (playerName: string) => {
  const [playerData, setPlayerData] = useState<{
    image: string;
    teamInfo: TeamInfo;
    heatMaps: HeatMapData;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [image, teamInfo, heatMaps] = await Promise.all([
          cachedFetch(`image-${playerName}`, () => getPlayerImage(playerName)),
          cachedFetch(`team-${playerName}`, () => getTeamInfo(playerName)),
          cachedFetch(`heatmaps-${playerName}`, () => fetchHeatMaps(playerName))
        ]);
        setPlayerData({ image, teamInfo, heatMaps });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [playerName]);

  return { data: playerData, loading, error };
};