import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
export * from "./errors";
export type SupabaseClient = ReturnType<typeof createClient<Database>>;
export type { Role, Permission, RoleMember, OrganizationMember, TeamMember, MemberRolesResponse, PermissionRequirement, RoleBasedProps, } from "./types/roles";
export * from "./types/database-functions.types";
export type { Json } from "./types";
export type MembershipType = Database["public"]["Enums"]["membership_type"];
export * from "./types/roles";
export type { Database } from "./database.types";
export type { Tables } from "./database.types";
export * from "./module/users";
export * from "./module/users.react";
export * from "./module/organizations";
export * from "./module/organizations.react";
export * from "./module/organization-members";
export * from "./module/organization-members.react";
export * from "./module/teams";
export * from "./module/teams.react";
export * from "./module/team-members";
export * from "./module/team-members.react";
export * from "./database.types";
export * from "./types";
export * from "./module/organization-members.react";
export * from "./module/users";
export * from "./factories";
export * from "./module/invitations.react";
export * from "./module/roles.react";
//# sourceMappingURL=index.d.ts.map