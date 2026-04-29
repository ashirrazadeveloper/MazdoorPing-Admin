import { NextResponse } from "next/server";
import { mockEmployers } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  let filtered = [...mockEmployers];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.full_name.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        (e.company_name && e.company_name.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({ employers: filtered, total: filtered.length });
}
