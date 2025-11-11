import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ✅ Fix 1: Typo in http
    const API_URL = process.env.API_URL || "http://localhost:3001";

    // ✅ Fix 2: Use backticks correctly for template literal
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",

      // ✅ Fix 3: Header name should not have an extra space
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
