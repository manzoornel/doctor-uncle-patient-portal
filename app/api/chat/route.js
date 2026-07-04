import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// The client sends the patient's own visit/vitals/lab/medication data
// (already fetched via /api/grandis with their token) plus the question.
// We never store this data server-side — it's passed through per-request.
export async function POST(req) {
  try {
    const { question, patientContext, lang } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not set on the server." },
        { status: 500 }
      );
    }

    const system = `You are the in-app health assistant for Doctor Uncle Family Clinic patients.
Rules:
- Answer using ONLY the patient data provided below. Never invent values.
- If the answer isn't in the provided data, say so and suggest they ask at their next visit.
- Reply in the same language the patient asked in (Malayalam or English), naturally, not a literal translation.
- Keep answers short (2-4 sentences), warm, and clear — this is a layperson, not a doctor.
- Never give new diagnoses, dosage changes, or treatment advice beyond what's in the data. For anything medical beyond simple explanation, tell them to consult their doctor at Doctor Uncle Family Clinic.

Patient data (JSON):
${JSON.stringify(patientContext)}`;

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system,
      messages: [{ role: "user", content: question }],
    });

    const text = msg.content.find((b) => b.type === "text")?.text || "";
    return NextResponse.json({ answer: text });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Chat request failed" }, { status: 500 });
  }
}
