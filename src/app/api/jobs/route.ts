import { NextResponse } from "next/server";
import { mockJobs } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";

  let filtered = [...mockJobs];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (j) => j.title.toLowerCase().includes(q) || j.city.toLowerCase().includes(q)
    );
  }
  if (status !== "all") {
    filtered = filtered.filter((j) => j.status === status);
  }

  return NextResponse.json({ jobs: filtered, total: filtered.length });
}
