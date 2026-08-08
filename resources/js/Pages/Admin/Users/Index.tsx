import { FormEventHandler, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: "customer" | "admin";
    bookings_count: number;
    created_at: string;
}

export default function AdminUsersIndex({
    users,
    filters,
}: {
    users: {
        data: AdminUser[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string };
}) {
    const { props } = usePage<{
        flash?: { success?: string };
        auth: { user: { id: number } };
    }>();
    const [search, setSearch] = useState(filters.search ?? "");

    const submitSearch: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(
            route("admin.users.index"),
            { search },
            { preserveState: true, preserveScroll: true },
        );
    };

    const toggleRole = (user: AdminUser) => {
        const nextRole = user.role === "admin" ? "customer" : "admin";
        if (confirm(`Change ${user.name}'s role to ${nextRole}?`)) {
            router.patch(
                route("admin.users.role", user.id),
                { role: nextRole },
                { preserveScroll: true },
            );
        }
    };

    return (
        <AdminLayout title="Users">
            <Head title="Manage Users — Admin" />

            {props.flash?.success && (
                <div className="mb-6 rounded-md border border-brass/30 bg-brass/10 p-4 text-sm text-ink">
                    {props.flash.success}
                </div>
            )}

            <form onSubmit={submitSearch} className="flex gap-2">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email"
                    className="w-72 rounded-md border-hairline text-sm focus:border-brass focus:ring-brass"
                />
                <button
                    type="submit"
                    className="rounded-md border border-hairline px-4 text-sm text-ink"
                >
                    Search
                </button>
            </form>

            <div className="mt-6 overflow-hidden rounded-tag border border-hairline bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-hairline bg-ivory text-xs uppercase tracking-widest text-sage">
                        <tr>
                            <th className="px-5 py-3">Name</th>
                            <th className="px-5 py-3">Email</th>
                            <th className="px-5 py-3">Role</th>
                            <th className="px-5 py-3">Bookings</th>
                            <th className="px-5 py-3">Joined</th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-hairline last:border-0"
                            >
                                <td className="px-5 py-3 font-medium text-ink">
                                    {user.name}
                                </td>
                                <td className="px-5 py-3 text-charcoal/70">
                                    {user.email}
                                </td>
                                <td className="px-5 py-3">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${user.role === "admin" ? "bg-brass/20 text-brass-dark" : "bg-sage/20 text-sage"}`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-charcoal/70">
                                    {user.bookings_count}
                                </td>
                                <td className="px-5 py-3 text-charcoal/70">
                                    {user.created_at}
                                </td>
                                <td className="px-5 py-3 text-right">
                                    {user.id !== props.auth.user.id && (
                                        <button
                                            onClick={() => toggleRole(user)}
                                            className="text-sm text-ink underline decoration-brass underline-offset-4"
                                        >
                                            Make{" "}
                                            {user.role === "admin"
                                                ? "customer"
                                                : "admin"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {users.data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-5 py-12 text-center text-sage"
                                >
                                    No users match this search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
