import { NextRequest, NextResponse } from "next/server";
import { predict, getPercentile, type PredictionInput, type State } from "@/lib/model";

// Public, unauthenticated endpoint for embedding the predictor on external sites.
// Unlike /api/predict, this does not require a session cookie.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const VALID_STATES: State[] = ["California", "Florida", "New York"];

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const { rd, admin, marketing, state } = body as PredictionInput & {
    rd: unknown;
    admin: unknown;
    marketing: unknown;
    state: unknown;
  };

  if (typeof rd !== "number" || typeof admin !== "number" || typeof marketing !== "number") {
    return NextResponse.json(
      { error: "rd, admin, marketing must be numbers" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  if (typeof state !== "string" || !VALID_STATES.includes(state as State)) {
    return NextResponse.json(
      { error: `state must be one of ${VALID_STATES.join(", ")}` },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const input: PredictionInput = { rd, admin, marketing, state: state as State };
  const prediction = predict(input);
  const percentile = getPercentile(prediction);

  return NextResponse.json({ prediction, percentile }, { headers: CORS_HEADERS });
}
