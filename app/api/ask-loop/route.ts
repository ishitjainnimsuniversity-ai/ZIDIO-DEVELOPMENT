import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { handleApiError } from "@/lib/api-response";
import { AskLoopSchema } from "@/lib/validation/ask-loop.schema";
import { AskLoopService } from "@/services/ask-loop.service";

export const dynamic = "force-dynamic";

/**
 * POST /api/ask-loop
 * Answers questions about workspace feedback using grounded semantic vector retrieval.
 * Returns dual-compatible answer + cited evidence snippets for UI and API consumers.
 */
export async function POST(req: NextRequest) {
  try {
    let workspaceId = "ws_demo_acme";
    try {
      const session = await getAuthSession(req);
      if (session?.workspaceId) workspaceId = session.workspaceId;
    } catch (e) {
      // Demo mode
    }

    const body = await req.json().catch(() => ({}));
    const question = body.question || body.prompt || body.query || "";
    const input = AskLoopSchema.parse({ question });

    const result = await AskLoopService.ask(workspaceId, input);

    return NextResponse.json({
      success: true,
      answer: result.answer,
      evidence: result.evidence || [],
      suggestedNextQuestions: result.suggestedNextQuestions || [],
      sentimentSummary: result.sentimentSummary,
      data: result
    });
  } catch (error) {
    return handleApiError(error);
  }
}
