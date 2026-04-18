import { NextResponse } from 'next/server';
import { mockBalanceConsultation } from '@/lib/mock-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contractId = searchParams.get('contractId') || 'LAN240478508299911';

    // Fetch the real-time collective pool balance
    const balanceRes = await mockBalanceConsultation(contractId);
    
    // Parse value replacing comma with dot if needed
    const balanceStr = balanceRes.data.result.balance[0].value.replace(',', '.');
    const collective_balance = parseFloat(balanceStr);

    // Mock individual contribution for demo purposes
    const individual_contribution = 150.00;
    
    let contribution_percentage = 0;
    if (collective_balance > 0) {
      contribution_percentage = Number(((individual_contribution / collective_balance) * 100).toFixed(2));
    }

    return NextResponse.json({
      collective_balance,
      individual_contribution,
      contribution_percentage
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
