import { NextResponse } from "next/server";
import { mockDashboardStats, mockRevenueData, mockCategoryData, mockCityData, mockActivity } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    stats: mockDashboardStats,
    revenueData: mockRevenueData,
    categoryData: mockCategoryData,
    cityData: mockCityData,
    recentActivity: mockActivity,
  });
}
