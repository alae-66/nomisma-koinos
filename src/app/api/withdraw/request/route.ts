import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId, poolId, amount } = await request.json();

    if (!userId || !poolId || amount === undefined) {
      return NextResponse.json({ error: 'Missing userId, poolId, or amount' }, { status: 400 });
    }

    const entryId = `e_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const voteId = `v_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const createWithdrawRequest = db.transaction((uId, pId, amt, eId, vId) => {
      // Create Pending transaction
      const insertLedger = db.prepare(`
        INSERT INTO Ledger_Entries (Entry_ID, User_ID, Pool_ID, Amount, Type, Trigger_Source)
        VALUES (?, ?, ?, ?, 'Pending', 'Withdrawal Request')
      `);
      insertLedger.run(eId, uId, pId, -Math.abs(amt)); // Ensure it's a negative amount

      // Initiate a Vote object (assuming creator automatically approves their own request)
      const insertVote = db.prepare(`
        INSERT INTO Votes (Vote_ID, Request_ID, User_ID, Status)
        VALUES (?, ?, ?, 'Approve')
      `);
      insertVote.run(vId, eId, uId);
    });

    createWithdrawRequest(userId, poolId, amount, entryId, voteId);

    return NextResponse.json({ 
      success: true, 
      message: 'Withdrawal request created and vote initiated',
      requestId: entryId,
      voteId
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
