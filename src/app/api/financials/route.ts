import { NextResponse } from "next/server";
import { mockTransactions, mockWithdrawals } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";
  const status = searchParams.get("status") || "all";

  let filtered = [...mockTransactions];

  if (type !== "all") {
    filtered = filtered.filter((t) => t.type === type);
  }
  if (status !== "all") {
    filtered = filtered.filter((t) => t.status === status);
  }

  const totalRevenue = mockTransactions
    .filter((t) => t.type === "commission" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingPayouts = mockTransactions
    .filter((t) => t.type === "payout" && t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  return NextResponse.json({
    transactions: filtered,
    withdrawals: mockWithdrawals,
    total: filtered.length,
    totalRevenue,
    pendingPayouts,
  });
}
