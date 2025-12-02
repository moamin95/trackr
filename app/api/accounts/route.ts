import { NextRequest, NextResponse } from "next/server";
import { getAccounts } from "@lib/db";

export async function GET(request: NextRequest) {
  try {
    const res = getAccounts();
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
