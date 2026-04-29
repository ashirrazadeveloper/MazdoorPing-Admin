import { NextResponse } from "next/server";
import { mockSOSAlerts } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "all";

  let filtered = [...mockSOSAlerts];

  if (status !== "all") {
    filtered = filtered.filter((a) => a.status === status);
  }

  return NextResponse.json({
    alerts: filtered,
    total: filtered.length,
    active: mockSOSAlerts.filter((a) => a.status === "active").length,
  });
}
