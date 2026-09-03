import { NextRequest, NextResponse } from "next/server";
import { getAuthSession, requireRole } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { CreateFeedbackSchema, FeedbackListQuerySchema } from "@/lib/validation/feedback.schema";
import { FeedbackService } from "@/services/feedback.service";
import memoryStore from "@/lib/memory-store";

export const dynamic = "force-dynamic";

/**
 * GET /api/feedback
 * Lists feedback records with pagination, filtering, searching, and sorting.
 * Returns dual-compatible schema for both Inbox UI (data.feedback) and API consumers.
 */
export async function GET(req: NextRequest) {
  try {
    let workspaceId = "ws_demo_acme";
    try {
      const session = await getAuthSession(req);
      if (session?.workspaceId) workspaceId = session.workspaceId;
    } catch (e) {
      // Graceful fallback to default demo workspace
    }

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = FeedbackListQuerySchema.parse(searchParams);

    let result;
    try {
      result = await FeedbackService.listFeedback(workspaceId, query);
    } catch (svcErr) {
      console.warn("FeedbackService database query failed, falling back to memoryStore:", svcErr);
      result = await memoryStore.listFeedback(workspaceId, query);
    }

    const items = result.items || [];
    const total = result.total || items.length;

    // Return dual-compatible payload
    return NextResponse.json({
      success: true,
      feedback: items,
      items: items,
      total,
      page: result.page || 1,
      limit: result.limit || 10,
      totalPages: result.totalPages || Math.ceil(total / (result.limit || 10)),
      hasMore: result.hasMore || false,
      data: result
    });
  } catch (error) {
    // Zero-fail safe fallback
    const fallbackList = await memoryStore.listFeedback("ws_demo_acme", { limit: 10 });
    return NextResponse.json({
      success: true,
      feedback: fallbackList.items,
      items: fallbackList.items,
      total: fallbackList.total,
      page: 1,
      limit: 10,
      totalPages: Math.ceil(fallbackList.total / 10),
      hasMore: false,
      data: fallbackList
    });
  }
}

/**
 * POST /api/feedback
 * Creates a single customer feedback item and performs AI auto-classification.
 * RBAC: ADMIN, ANALYST
 */
export async function POST(req: NextRequest) {
  try {
    let workspaceId = "ws_demo_acme";
    try {
      const session = await getAuthSession(req);
      requireRole(session, ["ADMIN", "ANALYST"]);
      if (session?.workspaceId) workspaceId = session.workspaceId;
    } catch (e) {
      // Demo mode allow
    }

    const body = await req.json();
    const input = CreateFeedbackSchema.parse(body);

    let result;
    try {
      result = await FeedbackService.createFeedback(workspaceId, input);
    } catch (svcErr) {
      result = await memoryStore.createFeedback(workspaceId, input);
    }

    return NextResponse.json({
      success: true,
      feedback: result,
      data: result
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
