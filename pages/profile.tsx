import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    fetch('/api/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/');
      });
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) return <div className="p-8 text-center animate-pulse font-heading text-xl">Loading Profile...</div>;

  return (
    <div className="px-4 py-12 max-w-2xl mx-auto space-y-8 text-center">
      <div className="space-y-4">
        <div className="w-24 h-24 bg-accent-gold rounded-full flex items-center justify-center text-4xl mx-auto shadow-2xl">
          👤
        </div>
        <div>
          <h1 className="text-3xl text-text-primary mb-1 uppercase tracking-tight">{user?.email}</h1>
          <p className="text-text-secondary text-xs uppercase font-bold tracking-widest">Team Owner</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-surface p-6 rounded-3xl border border-dark-border">
          <p className="text-accent-gold font-heading text-3xl">127</p>
          <p className="text-text-secondary text-[10px] uppercase font-bold">Total Points</p>
        </div>
        <div className="bg-dark-surface p-6 rounded-3xl border border-dark-border">
          <p className="text-accent-gold font-heading text-3xl">4</p>
          <p className="text-text-secondary text-[10px] uppercase font-bold">Slates Played</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full py-4 rounded-xl bg-accent-red/10 text-accent-red border border-accent-red/30 font-heading text-xl transition-all hover:bg-accent-red hover:text-text-primary"
      >
        LOGOUT
      </button>

      <div className="pt-12 border-t border-dark-border">
        <p className="text-text-secondary text-xs">AFCON 2025 Daily Fantasy</p>
        <p className="text-text-secondary text-[10px] uppercase tracking-tighter mt-1 opacity-50">v0.1.0-AFCON</p>
      </div>
    </div>
  );
}
