import { NextRequest } from "next/server";
import { ApiError } from "./api-response";
import { UserRole } from "@/types/api";
import { auth as nextAuth } from "@/auth";

export interface AuthenticatedUser {
  userId: string;
  email: string;
  name: string | null;
  role: UserRole;
  workspaceId: string;
  workspaceSlug: string;
}

export const DEMO_USERS: Record<string, AuthenticatedUser> = {
  admin: {
    userId: "usr_admin_001",
    email: "admin@loop.dev",
    name: "Admin User",
    role: "ADMIN",
    workspaceId: "ws_demo_acme",
    workspaceSlug: "acme-corp",
  },
  analyst: {
    userId: "usr_analyst_001",
    email: "analyst@loop.dev",
    name: "Analyst User",
    role: "ANALYST",
    workspaceId: "ws_demo_acme",
    workspaceSlug: "acme-corp",
  },
  viewer: {
    userId: "usr_viewer_001",
    email: "viewer@loop.dev",
    name: "Viewer User",
    role: "VIEWER",
    workspaceId: "ws_demo_acme",
    workspaceSlug: "acme-corp",
  },
  foreign_tenant: {
    userId: "usr_foreign_001",
    email: "foreign@competitor.io",
    name: "Foreign Tenant User",
    role: "ADMIN",
    workspaceId: "ws_foreign_competitor",
    workspaceSlug: "competitor-corp",
  },
};

export async function getAuthenticatedUser(req?: Request | NextRequest): Promise<AuthenticatedUser> {
  // 1. Check NextAuth session
  try {
    const session = await nextAuth();
    if (session?.user && session.user.workspaceId) {
      return {
        userId: session.user.id || "usr_session",
        email: session.user.email || "user@loop.dev",
        name: session.user.name || null,
        role: (session.user.role as UserRole) || "ANALYST",
        workspaceId: session.user.workspaceId,
        workspaceSlug: "acme-corp",
      };
    }
  } catch (err) {
    // Ignore NextAuth resolution errors during build or testing
  }

  // 2. Check authorization headers or development role
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      if (token === "demo-admin-token") return DEMO_USERS.admin;
      if (token === "demo-analyst-token") return DEMO_USERS.analyst;
      if (token === "demo-viewer-token") return DEMO_USERS.viewer;
      if (token === "foreign-tenant-token") return DEMO_USERS.foreign_tenant;
    }

    const devRole = req.headers.get("x-dev-user") || req.headers.get("x-user-role");
    if (devRole && DEMO_USERS[devRole.toLowerCase()]) {
      return DEMO_USERS[devRole.toLowerCase()];
    }
  }

  // 3. Fallback for development / serverless demo environments
  return DEMO_USERS.admin;
}

export async function getAuthSession(req?: NextRequest): Promise<AuthenticatedUser> {
  return getAuthenticatedUser(req);
}

export function requireRole(user: AuthenticatedUser, allowedRoles: UserRole[]): void {
  if (!allowedRoles.includes(user.role)) {
    throw new ApiError(403, "FORBIDDEN", `Access forbidden: requires ${allowedRoles.join(" or ")} role.`);
  }
}
