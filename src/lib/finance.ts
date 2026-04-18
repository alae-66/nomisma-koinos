export function calculateRoundUp(amount: number) {
  // Rounds the transaction to the nearest higher dollar
  const roundedAmount = Math.ceil(amount);
  const roundUpAmount = roundedAmount - amount;

  // Calculates an additional "Social Tip" of 1%
  const socialTip = amount * 0.01;

  // Returns the total to be diverted to the Nomisma Koinos escrow
  const totalDiverted = roundUpAmount + socialTip;

  return {
    originalAmount: amount,
    roundedAmount,
    roundUpAmount: Number(roundUpAmount.toFixed(2)),
    socialTip: Number(socialTip.toFixed(2)),
    totalDiverted: Number(totalDiverted.toFixed(2))
  };
}
