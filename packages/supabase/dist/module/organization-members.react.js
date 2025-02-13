"use client";
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { moduleToast } from "../lib/toast";
import { getOrganizationMember, getOrganizationMembers, createOrganizationMember, updateOrganizationMember, deleteOrganizationMember, } from "./organization-members";
/**
 * React Query key factory for organization member-related queries
 */
export const organizationMemberKeys = {
    all: ["organization-members"],
    lists: () => ["organization-members", "list"],
    list: (filters) => [
        "organization-members",
        "list",
        filters,
    ],
    details: () => ["organization-members", "detail"],
    detail: (id) => ["organization-members", "detail", id],
};
/**
 * Static query keys for server-side usage
 */
export const organizationMemberQueryKeys = {
    all: ["organization-members"],
    lists: ["organization-members", "list"],
    list: (filters) => [
        "organization-members",
        "list",
        filters,
    ],
    details: ["organization-members", "detail"],
    detail: (id) => ["organization-members", "detail", id],
};
/**
 * Hook for fetching a single organization member by ID.
 *
 * @param {object} params - Hook parameters
 * @param {string} params.memberId - The ID of the organization member to fetch
 * @param {SupabaseClient} params.supabase - Supabase client instance
 * @param {Partial<UseQueryOptions<OrganizationMember | null, OrganizationMemberOperationError>>} [params.options] - Additional React Query options
 * @returns Query result with data and error
 *
 * @example
 * ```typescript
 * const { data: member, isLoading, error } = useOrganizationMember({
 *   memberId: 'member-123',
 *   supabase
 * });
 * ```
 */
export function useOrganizationMember({ memberId, supabase, options = {}, }) {
    const queryKey = memberId
        ? organizationMemberKeys.detail(memberId)
        : ["organization-members", "detail", "NO_ID"];
    const queryFn = async () => getOrganizationMember({ supabase, memberId });
    return useQuery({
        queryKey,
        queryFn: queryFn,
        ...options,
    });
}
/**
 * Hook for fetching all members of an organization.
 *
 * @param {object} params - Hook parameters
 * @param {string} params.organizationId - The ID of the organization
 * @param {SupabaseClient} params.supabase - Supabase client instance
 * @param {Partial<UseQueryOptions<OrganizationMember[], OrganizationMemberOperationError>>} [params.options] - Additional React Query options
 * @returns Query result with data and error
 *
 * @example
 * ```typescript
 * const { data: members, isLoading, error } = useOrganizationMembers({
 *   organizationId: 'org-123',
 *   supabase
 * });
 * ```
 */
export function useOrganizationMembers({ organizationId, supabase, options = {}, }) {
    return useQuery({
        queryKey: organizationMemberKeys.list({ organizationId }),
        queryFn: async () => getOrganizationMembers({ supabase, organizationId }),
        ...options,
    });
}
/**
 * Hook for creating a new organization member, with toast notifications.
 *
 * @param {object} params - Hook parameters
 * @param {SupabaseClient} params.supabase - Supabase client instance
 * @param {Partial<UseMutationOptions<OrganizationMember, OrganizationMemberOperationError, { member: OrganizationMemberInsert }>>} [params.options] - Mutation options
 * @returns Mutation result with status and handlers
 *
 * @example
 * ```typescript
 * const { mutate: executeCreateMember } = useCreateOrganizationMember({
 *   supabase,
 *   options: {
 *     onSuccess: (newMember) => {
 *       console.log('Member created:', newMember);
 *     },
 *   },
 * });
 *
 * executeCreateMember({
 *   member: {
 *     organization_id: 'org-123',
 *     user_id: 'user-123',
 *     role_id: 'role-123',
 *     membership_type: 'team'
 *   }
 * });
 * ```
 */
export function useCreateOrganizationMember({ supabase, options = {}, }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ member }) => createOrganizationMember({ supabase, member }),
        onSuccess: (data, variables, ctx) => {
            if (data.organization_id) {
                queryClient.invalidateQueries({
                    queryKey: organizationMemberKeys.list({
                        organizationId: data.organization_id,
                    }),
                });
            }
            moduleToast.success("Organization member added successfully!");
            if (options?.onSuccess)
                options.onSuccess(data, variables, ctx);
        },
        onError: (err, variables, ctx) => {
            moduleToast.error(`${err.toastMessage}`);
            throw err;
        },
        ...options,
        throwOnError: true,
    });
}
/**
 * Hook for updating an organization member, with toast notifications.
 *
 * @param {object} params - Hook parameters
 * @param {SupabaseClient} params.supabase - Supabase client instance
 * @param {Partial<UseMutationOptions<OrganizationMember, OrganizationMemberOperationError, { memberId: string; member: OrganizationMemberUpdate }>>} [params.options] - Mutation options
 * @returns Mutation result with status and handlers
 *
 * @example
 * ```typescript
 * const { mutate: executeUpdateMember } = useUpdateOrganizationMember({
 *   supabase,
 *   options: {
 *     onSuccess: (updatedMember) => {
 *       console.log('Member updated:', updatedMember);
 *     },
 *   },
 * });
 *
 * executeUpdateMember({
 *   memberId: 'member-123',
 *   member: { role_id: 'new-role-123' }
 * });
 * ```
 */
export function useUpdateOrganizationMember({ supabase, options = {}, }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ memberId, member }) => updateOrganizationMember({ supabase, memberId, member }),
        onSuccess: (data, variables, ctx) => {
            queryClient.invalidateQueries({
                queryKey: organizationMemberKeys.detail(variables.memberId),
            });
            if (data.organization_id) {
                queryClient.invalidateQueries({
                    queryKey: organizationMemberKeys.list({
                        organizationId: data.organization_id,
                    }),
                });
            }
            moduleToast.success("Organization member updated successfully!");
            if (options?.onSuccess)
                options.onSuccess(data, variables, ctx);
        },
        onError: (err, variables, ctx) => {
            moduleToast.error(`${err.toastMessage}`);
            throw err;
        },
        ...options,
        throwOnError: true,
    });
}
/**
 * Hook for deleting an organization member, with toast notifications.
 *
 * @param {object} params - Hook parameters
 * @param {SupabaseClient} params.supabase - Supabase client instance
 * @param {Partial<UseMutationOptions<void, OrganizationMemberOperationError, { memberId: string; organizationId: string }>>} [params.options] - Mutation options
 * @returns Mutation result with status and handlers
 *
 * @example
 * ```typescript
 * const { mutate: executeDeleteMember } = useDeleteOrganizationMember({
 *   supabase,
 *   options: {
 *     onSuccess: () => {
 *       console.log('Member deleted');
 *     },
 *   },
 * });
 *
 * executeDeleteMember({
 *   memberId: 'member-123',
 *   organizationId: 'org-123'
 * });
 * ```
 */
export function useDeleteOrganizationMember({ supabase, options = {}, }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ memberId }) => deleteOrganizationMember({ supabase, memberId }),
        onSuccess: (_, variables, ctx) => {
            queryClient.invalidateQueries({
                queryKey: organizationMemberKeys.detail(variables.memberId),
            });
            queryClient.invalidateQueries({
                queryKey: organizationMemberKeys.list({
                    organizationId: variables.organizationId,
                }),
            });
            moduleToast.success("Organization member removed successfully!");
            if (options?.onSuccess)
                options.onSuccess(_, variables, ctx);
        },
        onError: (err, variables, ctx) => {
            moduleToast.error(`${err.toastMessage}`);
            throw err;
        },
        ...options,
        throwOnError: true,
    });
}
