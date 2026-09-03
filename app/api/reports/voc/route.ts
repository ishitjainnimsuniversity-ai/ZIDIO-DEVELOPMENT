import { NextRequest, NextResponse } from "next/server";
import { getAuthSession, requireRole } from "@/lib/auth";
import { handleApiError } from "@/lib/api-response";
import { GenerateVocReportSchema } from "@/lib/validation/voc-report.schema";
import { VocReportService } from "@/services/voc-report.service";

export const dynamic = "force-dynamic";

/**
 * GET /api/reports/voc
 * Lists all generated Voice-of-Customer reports for the workspace.
 */
export async function GET(req: NextRequest) {
  try {
    let workspaceId = "ws_demo_acme";
    try {
      const session = await getAuthSession(req);
      if (session?.workspaceId) workspaceId = session.workspaceId;
    } catch (e) {
      // Demo mode
    }

    const reports = await VocReportService.listReports(workspaceId);
    return NextResponse.json({
      success: true,
      reports,
      data: reports
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/reports/voc
 * Generates and stores a new Voice-of-Customer report with AI executive narrative.
 * Dual-compatible with both ReportsPage UI (data.report / data.aiNarrative) and API consumers.
 */
export async function POST(req: NextRequest) {
  try {
    let workspaceId = "ws_demo_acme";
    try {
      const session = await getAuthSession(req);
      requireRole(session, ["ADMIN", "ANALYST"]);
      if (session?.workspaceId) workspaceId = session.workspaceId;
    } catch (e) {
      // Demo mode
    }

    const body = await req.json().catch(() => ({}));
    const input = GenerateVocReportSchema.parse(body);

    const report = await VocReportService.generateReport(workspaceId, input);
    return NextResponse.json({
      success: true,
      report,
      aiNarrative: report.aiNarrative,
      data: report
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
