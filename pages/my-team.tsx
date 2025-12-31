import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MyTeamPage() {
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/'); // Or login
          return;
        }

        const res = await fetch('/api/lineup/current', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.slate) {
          router.replace(`/slate/${data.slate.id}`);
        } else {
          router.replace('/');
        }
      } catch (err) {
        console.error(err);
        router.replace('/');
      }
    };

    load();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-accent-gold font-heading text-2xl animate-pulse">Entering Stadium...</div>
    </div>
  );
}
