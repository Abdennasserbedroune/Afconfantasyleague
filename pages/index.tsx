import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container">
      <div className="card" style={{ padding: 18 }}>
        <h1 style={{ marginTop: 0 }}>Fantasy Tournament</h1>
        <p className="muted" style={{ marginTop: 6 }}>
          Use the Leaderboard to see global standings, or open My Team to review your entries and picks.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
          <Link className="btn btnPrimary" href="/leaderboard">
            View global standings
          </Link>
          <Link className="btn" href="/my-team">
            View my team
          </Link>
        </div>
      </div>
    </div>
  );
}
