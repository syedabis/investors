import { NextRequest, NextResponse } from "next/server";
import { predict, getPercentile, type PredictionInput } from "@/lib/model";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { rd, admin, marketing, state } = body as PredictionInput & {
    rd: unknown;
    admin: unknown;
    marketing: unknown;
  };

  if (typeof rd !== "number" || typeof admin !== "number" || typeof marketing !== "number") {
    return NextResponse.json({ error: "rd, admin, marketing must be numbers" }, { status: 400 });
  }

  const input: PredictionInput = { rd, admin, marketing, state };
  const prediction = predict(input);
  const percentile = getPercentile(prediction);

  return NextResponse.json({ prediction, percentile });
}
