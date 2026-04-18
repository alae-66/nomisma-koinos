import { NextResponse } from 'next/server';
import { mockWalletPrecreate, mockWalletActivate } from '@/lib/mock-api';

export async function POST(request: Request) {
  try {
    const { phoneNumber, phoneOperator, clientFirstName, clientLastName } = await request.json();

    if (!phoneNumber || !phoneOperator) {
      return NextResponse.json({ error: 'Missing required user details' }, { status: 400 });
    }

    // Step 1: Precreate wallet
    const precreateRes = await mockWalletPrecreate({
      phoneNumber,
      phoneOperator,
      clientFirstName,
      clientLastName
    });

    const { token } = precreateRes.data.result;

    // Step 2: Activate wallet using the OTP
    const activateRes = await mockWalletActivate({
      otp: "123456",
      token
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Wallet created and activated successfully', 
      walletDetails: activateRes.data.result 
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
