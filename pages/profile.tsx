import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchJson } from '@/lib/api';
import BottomNav from '@/components/BottomNav';
import ZellijPattern from '@/components/ZellijPattern';

interface UserProfile {
  email: string;
  teamName: string;
  totalPoints: number;
  slatesPlayed: number;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchJson<UserProfile>('/api/me');
        setProfile(data);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      await router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#0B0F14' }}>
        <div className="px-4 py-6 pb-24">
          <div className="text-center text-muted">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ background: '#0B0F14' }}>
        <div className="px-4 py-6 pb-24">
          <div className="text-center" style={{ color: '#D21034' }}>
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0B0F14' }}>
      {/* Main Content */}
      <main className="px-4 py-6 pb-24 max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-6 relative">
          <ZellijPattern position="top-right" opacity={0.1} />
          <div className="relative z-10">
            <h1
              className="text-2xl font-bold uppercase tracking-wider mb-2"
              style={{
                color: '#EAF0F6',
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '0.1em',
              }}
            >
              Profile
            </h1>
            <div
              className="h-0.5 w-20"
              style={{ background: '#E0B700' }}
            />
          </div>
        </header>

        {/* User Info Card */}
        {profile && (
          <div
            className="mb-6 p-6 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #111826 0%, #1A2636 100%)',
              border: '2px solid #E0B700',
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              {/* Avatar */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
                style={{
                  background: '#E0B700',
                  color: '#0B0F14',
                }}
              >
                {profile.teamName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2
                  className="text-xl font-bold mb-1"
                  style={{ color: '#EAF0F6' }}
                >
                  {profile.teamName}
                </h2>
                <p className="text-sm" style={{ color: '#A9B4C1' }}>
                  {profile.email}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p
                  className="text-3xl font-bold mb-1"
                  style={{ color: '#E0B700' }}
                >
                  {profile.totalPoints}
                </p>
                <p className="text-xs uppercase tracking-wider" style={{ color: '#A9B4C1' }}>
                  Total Points
                </p>
              </div>
              <div className="text-center">
                <p
                  className="text-3xl font-bold mb-1"
                  style={{ color: '#EAF0F6' }}
                >
                  {profile.slatesPlayed}
                </p>
                <p className="text-xs uppercase tracking-wider" style={{ color: '#A9B4C1' }}>
                  Slates Played
                </p>
              </div>
              <div className="text-center">
                <p
                  className="text-3xl font-bold mb-1"
                  style={{ color: '#EAF0F6' }}
                >
                  {profile.totalPoints && profile.slatesPlayed
                    ? (profile.totalPoints / profile.slatesPlayed).toFixed(1)
                    : '0'}
                </p>
                <p className="text-xs uppercase tracking-wider" style={{ color: '#A9B4C1' }}>
                  Avg Pts
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#A9B4C1' }}>
            Quick Actions
          </h3>

          <Link
            href="/my-team"
            className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
            style={{
              background: '#111826',
              border: '1px solid #2D3F54',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚽</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#EAF0F6' }}>
                  My Team
                </p>
                <p className="text-xs" style={{ color: '#A9B4C1' }}>
                  View your entries and picks
                </p>
              </div>
            </div>
            <span style={{ color: '#A9B4C1' }}>→</span>
          </Link>

          <Link
            href="/leaderboard"
            className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
            style={{
              background: '#111826',
              border: '1px solid #2D3F54',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#EAF0F6' }}>
                  Leaderboard
                </p>
                <p className="text-xs" style={{ color: '#A9B4C1' }}>
                  Check your ranking
                </p>
              </div>
            </div>
            <span style={{ color: '#A9B4C1' }}>→</span>
          </Link>

          <Link
            href="/help"
            className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
            style={{
              background: '#111826',
              border: '1px solid #2D3F54',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">❓</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#EAF0F6' }}>
                  Help
                </p>
                <p className="text-xs" style={{ color: '#A9B4C1' }}>
                  FAQ and support
                </p>
              </div>
            </div>
            <span style={{ color: '#A9B4C1' }}>→</span>
          </Link>
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-6 rounded-xl font-bold text-base uppercase tracking-wider transition-all"
            style={{
              background: 'rgba(210, 16, 52, 0.15)',
              color: '#F87171',
              border: '1px solid rgba(210, 16, 52, 0.3)',
            }}
          >
            Logout
          </button>
        </div>

        {/* App Info */}
        <div className="mt-12 text-center">
          <p className="text-xs" style={{ color: '#A9B4C1' }}>
            AFCON 2025 Fantasy Tournament
          </p>
          <p className="text-xs mt-1" style={{ color: '#64748B' }}>
            Version 1.0.0
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
