import { NextRequest, NextResponse } from "next/server";
import { getAllTransactions } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const formattedStartDate = startDate ? new Date(startDate) : undefined;
  const formattedEndDate = endDate ? new Date(endDate) : undefined;
  const res = getAllTransactions({
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  });
  return NextResponse.json(res);
}
