import { NextRequest, NextResponse } from "next/server";
import { oaa } from "../../../_lib/fetcher";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const data = await oaa(`/v1/ledger/balance/${params.userId}`, { method: "GET" });
  return NextResponse.json(data);
}
