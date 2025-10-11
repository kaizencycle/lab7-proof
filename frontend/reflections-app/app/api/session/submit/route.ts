import { NextRequest, NextResponse } from "next/server";
import { oaa } from "../../_lib/fetcher";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = await oaa("/v1/session/submit", { method: "POST", body: JSON.stringify(body) });
  return NextResponse.json(data);
}
