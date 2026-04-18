'use client';

import React, { useState } from 'react';
import styles from './MultiSigModal.module.css';

interface MultiSigModalProps {
  requestAmount: number;
  requestReason: string;
  requesterName: string;
  totalMembers: number;
  currentApprovals: number;
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => Promise<void>;
}

export default function MultiSigModal({
  requestAmount,
  requestReason,
  requesterName,
  totalMembers,
  currentApprovals,
  isOpen,
  onClose,
  onApprove
}: MultiSigModalProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  if (!isOpen) return null;

  const handleApprove = async () => {
    setIsApproving(true);
    await onApprove();
    setIsApproving(false);
    setIsApproved(true);
    
    // Auto close after showing success state
    setTimeout(() => {
      onClose();
      setIsApproved(false);
    }, 1500);
  };

  const threshold = Math.ceil(totalMembers / 2);
  const progressPercent = Math.min((currentApprovals / threshold) * 100, 100);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Withdrawal Request</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.requestDetails}>
            <div className={styles.amount}>${requestAmount.toFixed(2)}</div>
            <p>Requested by <strong>{requesterName}</strong></p>
            <p className={styles.reason}>"{requestReason}"</p>
          </div>

          <div className={styles.approvalStatus}>
            <div className={styles.statusHeader}>
              <span>Approvals Required</span>
              <span>{currentApprovals} / {threshold}</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          {isApproved ? (
            <button className={`${styles.btn} ${styles.btnSuccess}`} disabled>
              Approved! ✓
            </button>
          ) : (
            <button 
              className={`${styles.btn} ${styles.btnPrimary}`} 
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? 'Approving...' : 'Approve Request'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
