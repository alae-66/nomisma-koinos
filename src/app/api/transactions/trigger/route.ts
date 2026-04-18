import { NextResponse } from 'next/server';
import { mockWalletTransferSimulate, mockWalletTransferOtp, mockWalletTransferConfirm } from '@/lib/mock-api';

export async function POST(request: Request) {
  try {
    const { userId, poolId, transactionAmount } = await request.json();

    if (!userId || !poolId || transactionAmount === undefined) {
      return NextResponse.json({ error: 'Missing userId, poolId, or transactionAmount' }, { status: 400 });
    }

    // Calculate 2% tax
    const taxAmount = Number((transactionAmount * 0.02).toFixed(2));

    // Stage 1: Simulation
    const simulateRes = await mockWalletTransferSimulate();
    
    // Stage 2: OTP Generation
    const otpRes = await mockWalletTransferOtp();

    // Stage 3: Confirmation
    const confirmRes = await mockWalletTransferConfirm();

    return NextResponse.json({ 
      success: true, 
      taxAmount, 
      transferStatus: confirmRes.data.result,
      entryId: `e_${Date.now()}` // Mock entry ID
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
