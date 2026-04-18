'use client';

import React from 'react';
import styles from './PulseFeed.module.css';

interface Entry {
  id: string;
  user: string;
  amount: number;
  type: string;
  source: string;
  timestamp: string;
  avatar: string;
}

interface PulseFeedProps {
  entries: Entry[];
}

export default function PulseFeed({ entries }: PulseFeedProps) {
  return (
    <div className={styles.feedContainer}>
      <h3 className={styles.feedTitle}>The Pulse</h3>
      <div className={styles.scrollArea}>
        {entries.map(entry => (
          <div key={entry.id} className={styles.entryCard}>
            <img src={entry.avatar} alt="avatar" className={styles.avatar} />
            <div className={styles.entryInfo}>
              <p className={styles.entryText}>
                <strong>{entry.user}</strong> contributed via {entry.source}
              </p>
              <p className={styles.entryTime}>{new Date(entry.timestamp).toLocaleTimeString()}</p>
            </div>
            <div className={styles.entryAmount}>
              +${entry.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
