import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SlateBuilderPage() {
  const router = useRouter();
  const slateId = router.query.slateId as string | undefined;

  return (
    <div className="container">
      <div className="card">
        <div className="pageHeader">
          <h1>Slate {slateId} - Builder</h1>
          <div className="headerActions">
            <Link className="btn" href="/my-team">
              Back
            </Link>
          </div>
        </div>
        <div className="section">
          <p className="muted">
            Team builder UI would go here (out of scope for this ticket).
          </p>
          <p className="muted" style={{ marginTop: 10 }}>
            This page would let you select 11 players and designate a captain.
          </p>
        </div>
      </div>
    </div>
  );
}
