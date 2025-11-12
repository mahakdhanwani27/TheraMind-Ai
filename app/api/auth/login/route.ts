import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const API_URL = process.env.API_URL || "http://localhost:3001";

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Safely read text
    const text = await res.text();

    // Try parsing to JSON if possible
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // fallback for non-JSON responses
      data = { message: text || "Invalid response from backend" };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
