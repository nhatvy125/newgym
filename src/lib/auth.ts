export type RoleInput = string | Array<string | Record<string, unknown>> | Record<string, unknown> | null | undefined;

export function normalizeRole(roleInput: RoleInput): string | null {
  if (!roleInput) {
    return null;
  }

  if (typeof roleInput === "string") {
    return roleInput.toUpperCase().replace(/^ROLE_/, "");
  }

  if (Array.isArray(roleInput)) {
    for (const item of roleInput) {
      const normalized = normalizeRole(item as RoleInput);
      if (normalized) {
        if (normalized === "ADMIN") {
          return "ADMIN";
        }
        if (normalized === "USER") {
          return "USER";
        }
      }
    }
    return normalizeRole(roleInput[0] as RoleInput);
  }

  if (typeof roleInput === "object") {
    const obj = roleInput as Record<string, unknown>;
    return normalizeRole(obj.role as RoleInput ?? obj.authority as RoleInput ?? obj.name as RoleInput);
  }

  return null;
}

export function isAdminRole(roleInput: RoleInput): boolean {
  return normalizeRole(roleInput) === "ADMIN";
}
