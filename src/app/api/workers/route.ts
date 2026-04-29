import { NextResponse } from "next/server";
import { mockWorkers } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const city = searchParams.get("city") || "all";
  const status = searchParams.get("status") || "all";

  let filtered = [...mockWorkers];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (w) =>
        w.full_name.toLowerCase().includes(q) ||
        w.phone.includes(q) ||
        w.cnic.includes(q)
    );
  }
  if (category !== "all") {
    filtered = filtered.filter((w) => w.category_id === category);
  }
  if (city !== "all") {
    filtered = filtered.filter((w) => w.city === city);
  }
  if (status === "active") {
    filtered = filtered.filter((w) => w.is_active);
  } else if (status === "inactive") {
    filtered = filtered.filter((w) => !w.is_active);
  } else if (status === "verified") {
    filtered = filtered.filter((w) => w.is_verified);
  } else if (status === "unverified") {
    filtered = filtered.filter((w) => !w.is_verified);
  }

  return NextResponse.json({ workers: filtered, total: filtered.length });
}
