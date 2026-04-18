import { NextResponse } from 'next/server';
import { mockTransactionHistory } from '@/lib/mock-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contractId = searchParams.get('contractId') || 'LAN240478508299911';

    // Fetch the real-time operations history
    const historyRes = await mockTransactionHistory(contractId);

    return NextResponse.json({
      success: true,
      operations: historyRes.data.result.operations
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
