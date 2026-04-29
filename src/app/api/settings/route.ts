import { NextResponse } from "next/server";

export async function GET() {
  const settings = {
    commission_rate: 15,
    min_withdrawal_amount: 500,
    max_job_budget: 500000,
    supported_cities: [
      "Lahore", "Karachi", "Islamabad", "Rawalpindi",
      "Faisalabad", "Peshawar", "Multan", "Quetta",
    ],
    payment_methods: ["JazzCash", "Easypaisa", "Bank Transfer", "Cash on Delivery"],
    support_phone: "+92-300-0000000",
    support_email: "support@mazdoorping.pk",
  };

  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ success: true, settings: body });
}
