// src/lib/mock-api.ts

// 1. Wallet Pre-registration (POST /wallet?state=precreate)
export const mockWalletPrecreate = async (body: { phoneNumber: string, phoneOperator: string, clientFirstName: string, clientLastName: string }) => {
  return {
    status: 201,
    data: {
      result: {
        token: "TR2404781353895901",
        otp: "123456"
      }
    }
  };
};

// 2. Wallet Activation (POST /wallet?state=activate)
export const mockWalletActivate = async (body: { otp: string, token: string }) => {
  return {
    status: 200,
    data: {
      result: {
        contractId: "LAN240478508299911",
        rib: "853780241716465970216211"
      }
    }
  };
};

// Funding the Pool - 3 stage flow: Simulation, OTP, Confirmation
export const mockWalletTransferSimulate = async () => {
  return { status: 200, data: { result: { simulationId: "SIM987654321" } } };
};

export const mockWalletTransferOtp = async () => {
  return { status: 200, data: { result: { otp: "654321" } } };
};

export const mockWalletTransferConfirm = async () => {
  return { status: 200, data: { result: { status: "000", message: "Transfer successful" } } };
};

// 3. Balance Consultation (GET /wallet/balance)
export const mockBalanceConsultation = async (contractId: string) => {
  return {
    status: 200,
    data: {
      result: {
        balance: [
          { value: "12556,88" }
        ]
      }
    }
  };
};

// 4. Transaction History (GET /wallet/operations)
export const mockTransactionHistory = async (contractId: string) => {
  return {
    status: 200,
    data: {
      result: {
        operations: [
          {
            amount: "10.00",
            clientNote: "W2W",
            date: "12/8/2023 5:59:39 PM",
            referenceld: "1181798513",
            status: "000"
          },
          {
            amount: "5.50",
            clientNote: "Round-up",
            date: "12/8/2023 6:15:00 PM",
            referenceld: "1181798514",
            status: "000"
          }
        ]
      }
    }
  };
};
