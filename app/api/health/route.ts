import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "flowstate-pro",
    version: "1.0.0"
  });
}
