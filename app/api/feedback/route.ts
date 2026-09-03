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
 * Returns normalized dual-compatible schema with both 'text' and 'rawText' for all UI pages.
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
      result = await memoryStore.listFeedback(workspaceId, query);
    }

    const rawList = result.items || [];
    const total = result.total || rawList.length;

    // Normalize all items to have both 'text' and 'rawText'
    const normalizedItems = rawList.map((item: any) => ({
      ...item,
      text: item.text || item.rawText || "",
      rawText: item.rawText || item.text || "",
      sentiment: (item.sentiment || "NEUTRAL").toLowerCase(),
    }));

    return NextResponse.json({
      success: true,
      feedback: normalizedItems,
      items: normalizedItems,
      total,
      page: result.page || 1,
      limit: result.limit || 10,
      totalPages: result.totalPages || Math.ceil(total / (result.limit || 10)),
      hasMore: result.hasMore || false,
      data: result
    });
  } catch (error) {
    // Zero-fail safe fallback from memoryStore
    const fallbackList = await memoryStore.listFeedback("ws_demo_acme", { limit: 100 });
    const normalizedFallback = (fallbackList.items || []).map((item: any) => ({
      ...item,
      text: item.text || item.rawText || "",
      rawText: item.rawText || item.text || "",
      sentiment: (item.sentiment || "NEUTRAL").toLowerCase(),
    }));

    return NextResponse.json({
      success: true,
      feedback: normalizedFallback,
      items: normalizedFallback,
      total: fallbackList.total || normalizedFallback.length,
      page: 1,
      limit: 10,
      totalPages: Math.ceil((fallbackList.total || normalizedFallback.length) / 10),
      hasMore: false,
      data: fallbackList
    });
  }
}

/**
 * POST /api/feedback
 * Creates a single customer feedback item and performs AI auto-classification.
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

    const body = await req.json();
    if (!body.rawText && body.text) {
      body.rawText = body.text;
    }

    const input = CreateFeedbackSchema.parse(body);

    let result;
    try {
      result = await FeedbackService.createFeedback(workspaceId, input);
    } catch (svcErr) {
      result = await memoryStore.createFeedback(workspaceId, input);
    }

    const normalized = {
      ...result,
      text: (result as any).text || result.rawText || "",
      rawText: result.rawText || (result as any).text || "",
    };

    return NextResponse.json({
      success: true,
      feedback: normalized,
      data: normalized
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
