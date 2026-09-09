import { COMPANIES, Company } from "@/lib/companies";
import { WorkspaceUserId } from "@/lib/gate-config";

export const ACCFLARE_COMPANY_ID = "accelflare";

const OKAN_ALLOWED_COMPANY_IDS = new Set<string>([ACCFLARE_COMPANY_ID]);

export function getDefaultCompanyIdForUser(userId: WorkspaceUserId): string {
  if (userId === "okan") {
    return ACCFLARE_COMPANY_ID;
  }

  return COMPANIES[0].id;
}

export function isCompanyAccessible(
  userId: WorkspaceUserId,
  companyId: string,
): boolean {
  if (userId !== "okan") {
    return COMPANIES.some((company) => company.id === companyId);
  }

  return OKAN_ALLOWED_COMPANY_IDS.has(companyId);
}

export function resolveCompanyIdForUser(
  userId: WorkspaceUserId,
  companyId: string | null | undefined,
): string {
  const fallback = getDefaultCompanyIdForUser(userId);

  if (!companyId) {
    return fallback;
  }

  if (isCompanyAccessible(userId, companyId)) {
    return companyId;
  }

  return fallback;
}

export function getAccessibleCompanies(userId: WorkspaceUserId): Company[] {
  if (userId === "okan") {
    return COMPANIES.filter((company) => OKAN_ALLOWED_COMPANY_IDS.has(company.id));
  }

  return COMPANIES;
}

export function readCompanyIdFromUrl(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search).get("company");
}

export function writeCompanyIdToUrl(companyId: string) {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set("company", companyId);
  window.history.replaceState(null, "", url.toString());
}
