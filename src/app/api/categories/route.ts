import { NextResponse } from "next/server";
import { mockCategories } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ categories: mockCategories, total: mockCategories.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newCategory = {
    id: String(mockCategories.length + 1),
    ...body,
    total_workers: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return NextResponse.json({ category: newCategory }, { status: 201 });
}
