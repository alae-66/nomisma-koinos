'use client';

import React, { useState, useEffect } from 'react';
import GoalProgress from '@/components/GoalProgress';
import PulseFeed from '@/components/PulseFeed';
import MultiSigModal from '@/components/MultiSigModal';
import styles from './page.module.css';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);
  const goalAmount = 5000;
  const [entries, setEntries] = useState<any[]>([]);

  const [approvals, setApprovals] = useState(2);
  const totalMembers = 5;

  useEffect(() => {
    // Fetch initial balance and operations history
    const fetchData = async () => {
      try {
        const [statsRes, opsRes] = await Promise.all([
          fetch('/api/pool/stats'),
          fetch('/api/wallet/operations')
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setCurrentAmount(statsData.collective_balance || 0);
        }

        if (opsRes.ok) {
          const opsData = await opsRes.json();
          // Map Wallet API operations to PulseFeed entry format
          const mappedEntries = opsData.operations.map((op: any) => ({
            id: op.referenceld,
            user: op.clientNote === 'W2W' ? 'Member' : 'System',
            amount: parseFloat(op.amount),
            type: 'Credit',
            source: op.clientNote,
            timestamp: op.date,
            avatar: 'https://i.pravatar.cc/150?u=' + op.referenceld
          }));
          setEntries(mappedEntries);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleSimulateTransaction = async () => {
    // In a real app, this would be triggered by a webhook from a BaaS provider.
    // For demo, we just simulate the client triggering a social tax.
    try {
      const res = await fetch('/api/transactions/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'u1',
          poolId: 'p1',
          transactionAmount: 100.00 // simulates a $100 purchase
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Add new entry to feed based on the tax amount
        const newEntry = {
          id: data.entryId || Date.now().toString(),
          user: 'You',
          amount: data.taxAmount,
          type: 'Credit',
          source: 'Social Tax',
          timestamp: new Date().toLocaleString('en-US'),
          avatar: 'https://i.pravatar.cc/150?u=you'
        };
        
        setCurrentAmount(prev => prev + data.taxAmount);
        setEntries([newEntry, ...entries]);
      }
    } catch (e) {
      console.error(e);
      // Fallback for visual demo if API isn't running
      const tax = 2.00; // 2% of 100
      setCurrentAmount(prev => prev + tax);
      setEntries([{
        id: Date.now().toString(),
        user: 'You (Demo)',
        amount: tax,
        type: 'Credit',
        source: 'Social Tax',
        timestamp: new Date().toLocaleString('en-US'),
        avatar: 'https://i.pravatar.cc/150?u=demo'
      }, ...entries]);
    }
  };

  const handleApproveWithdrawal = async () => {
    // Simulate API call to register approval
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setApprovals(prev => prev + 1);
        resolve();
      }, 1000);
    });
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className="text-gradient">Nomisma Koinos</h1>
        <div className={styles.headerActions}>
          <button className="btn-primary" onClick={handleSimulateTransaction}>
            Simulate Purchase ($100)
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <GoalProgress currentAmount={currentAmount} goalAmount={goalAmount} />
          
          <div className={`card ${styles.actionCard}`}>
            <h3>Pending Withdrawals</h3>
            <p>A member has requested funds for a community project.</p>
            <button 
              className="btn-success" 
              onClick={() => setIsModalOpen(true)}
              style={{ marginTop: '16px' }}
            >
              Review Request
            </button>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <PulseFeed entries={entries} />
        </div>
      </div>

      <MultiSigModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        requestAmount={500}
        requesterName="Alice"
        requestReason="Micro-loan for new laptop"
        totalMembers={totalMembers}
        currentApprovals={approvals}
        onApprove={handleApproveWithdrawal}
      />
    </main>
  );
}
