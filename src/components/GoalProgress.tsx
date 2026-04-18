'use client';

import React from 'react';
import styles from './GoalProgress.module.css';

interface GoalProgressProps {
  currentAmount: number;
  goalAmount: number;
}

export default function GoalProgress({ currentAmount, goalAmount }: GoalProgressProps) {
  const percentage = Math.min((currentAmount / goalAmount) * 100, 100);
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Collective Goal</h3>
        <span className="text-gradient font-bold">{percentage.toFixed(1)}%</span>
      </div>
      <div className={styles.progressTrack}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className={styles.footer}>
        <span>${currentAmount.toLocaleString()}</span>
        <span>${goalAmount.toLocaleString()}</span>
      </div>
    </div>
  );
}
