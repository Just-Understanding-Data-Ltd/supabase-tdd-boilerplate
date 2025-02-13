"use client";
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { moduleToast } from "../lib/toast";
import { getUser, getUsers, createUser, updateUser, deleteUser, } from "./users";
/**
 * React Query key factory for user-related queries
 */
export const userKeys = {
    all: ["users"],
    lists: () => ["users", "list"],
    list: (filters) => [
        "users",
        "list",
        filters,
    ],
    details: () => ["users", "detail"],
    detail: (id) => ["users", "detail", id],
};
/**
 * Static query keys for server-side usage
 */
export const userQueryKeys = {
    all: ["users"],
    lists: ["users", "list"],
    list: (filters) => ["users", "list", filters],
    details: ["users", "detail"],
    detail: (id) => ["users", "detail", id],
};
/**
 * Hook for fetching a single user by ID.
 * If userId is undefined or empty, the query is skipped.
 *
 * @param {object} params - Hook parameters
 * @param {string} [params.userId] - The ID of the user to fetch
 * @param {SupabaseClient} params.supabase - Supabase client instance
 * @param {Partial<UseQueryOptions<User | null, UserOperationError>>} [params.options] - Additional React Query options
 * @returns Query result with data and error
 *
 * @example
 * ```typescript
 * const { data: user, isLoading, error } = useUser({ userId: '123', supabase });
 * ```
 */
export function useUser({ userId, supabase, options = {}, }) {
    const queryKey = userId
        ? userKeys.detail(userId)
        : ["users", "detail", "NO_ID"];
    const queryFn = async () => getUser({ supabase, userId });
    return useQuery({
        queryKey,
        queryFn: queryFn,
        ...options,
    });
}
/**
 * Hook for fetching all users.
 *
 * @param {object} params - Hook parameters
 * @param {SupabaseClient} params.supabase - Supabase client instance
 * @param {Partial<UseQueryOptions<UserList, UserOperationError>>} [params.options] - Additional React Query options
 * @returns Query result with data and error
 *
 * @example
 * ```typescript
 * const { data: users, isLoading, error } = useUsers({ supabase });
 * ```
 */
export function useUsers({ supabase, options = {}, }) {
    return useQuery({
        queryKey: userKeys.lists(),
        queryFn: async () => getUsers({ supabase }),
        ...options,
    });
}
/**
 * Hook for creating a new user, with toast notifications.
 *
 * @param {object} params - Hook parameters
 * @param {SupabaseClient} params.supabase - Supabase client instance
 * @param {Partial<UseMutationOptions<User, UserOperationError, { user: UserInsert }>>} [params.options] - Mutation options
 * @returns Mutation result with status and handlers
 *
 * @example
 * ```typescript
 * const { mutate: executeCreateUser, isLoading } = useCreateUser({
 *   supabase,
 *   options: {
 *     onSuccess: (newUser) => {
 *       console.log('User created:', newUser);
 *     },
 *   },
 * });
 *
 * executeCreateUser({ user: { full_name: 'John Doe', email: 'john@example.com' } });
 * ```
 */
export function useCreateUser({ supabase, options = {}, }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ user }) => createUser({ supabase, user }),
        onSuccess: (data, variables, ctx) => {
            queryClient.invalidateQueries({
                queryKey: userKeys.lists(),
            });
            moduleToast.success("User created successfully!");
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
 * Hook for updating an existing user by ID, with toast notifications.
 *
 * @param {object} params - Hook parameters
 * @param {SupabaseClient} params.supabase - Supabase client instance
 * @param {Partial<UseMutationOptions<User, UserOperationError, { userId: string; user: UserUpdate }>>} [params.options] - Mutation options
 * @returns Mutation result with status and handlers
 *
 * @example
 * ```typescript
 * const { mutate: executeUpdateUser, isLoading } = useUpdateUser({
 *   supabase,
 *   options: {
 *     onSuccess: (updatedUser) => {
 *       console.log('User updated:', updatedUser);
 *     },
 *   },
 * });
 *
 * executeUpdateUser({ userId: '123', user: { full_name: 'Updated Name' } });
 * ```
 */
export function useUpdateUser({ supabase, options = {}, }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, user }) => updateUser({ supabase, userId, user }),
        onSuccess: (data, variables, ctx) => {
            queryClient.invalidateQueries({
                queryKey: userKeys.detail(variables.userId),
            });
            queryClient.invalidateQueries({
                queryKey: userKeys.lists(),
            });
            moduleToast.success("User updated successfully!");
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
 * Hook for deleting a user by ID, with toast notifications.
 *
 * @param {object} params - Hook parameters
 * @param {SupabaseClient} params.supabase - Supabase client instance
 * @param {Partial<UseMutationOptions<void, UserOperationError, { userId: string }>>} [params.options] - Mutation options
 * @returns Mutation result with status and handlers
 *
 * @example
 * ```typescript
 * const { mutate: executeDeleteUser, isLoading } = useDeleteUser({
 *   supabase,
 *   options: {
 *     onSuccess: () => {
 *       console.log('User deleted');
 *     },
 *   },
 * });
 *
 * executeDeleteUser({ userId: '123' });
 * ```
 */
export function useDeleteUser({ supabase, options = {}, }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId }) => deleteUser({ supabase, userId }),
        onSuccess: (_, variables, ctx) => {
            queryClient.invalidateQueries({
                queryKey: userKeys.detail(variables.userId),
            });
            queryClient.invalidateQueries({
                queryKey: userKeys.lists(),
            });
            moduleToast.success("User deleted successfully!");
        },
        onError: (err, variables, ctx) => {
            moduleToast.error(`${err.toastMessage}`);
            throw err;
        },
        ...options,
        throwOnError: true,
    });
}
