import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { handle, email } = await req.json();
  const email_hash = email ? crypto.createHash("sha256").update(email.toLowerCase()).digest("hex") : null;

  const user = await prisma.user.upsert({
    where: { handle },
    update: { email_hash },
    create: { handle, email_hash },
  });

  return NextResponse.json({ user });
}
