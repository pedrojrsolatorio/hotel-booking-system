import { FormEventHandler, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import type { Booking, PaginatedData } from "@/types/models";

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-brass/20 text-brass-dark",
    confirmed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-charcoal/10 text-charcoal/60",
    completed: "bg-sage/20 text-sage",
};

const STATUSES = ["pending", "confirmed", "cancelled", "completed"];

export default function AdminBookingsIndex({
    bookings,
    filters,
}: {
    bookings: PaginatedData<Booking>;
    filters: { search?: string; status?: string };
}) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const [search, setSearch] = useState(filters.search ?? "");

    const applyFilters = (overrides: Partial<typeof filters>) => {
        router.get(
            route("admin.bookings.index"),
            { ...filters, ...overrides },
            { preserveState: true, preserveScroll: true },
        );
    };

    const submitSearch: FormEventHandler = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const updateStatus = (booking: Booking, status: string) => {
        router.patch(
            route("admin.bookings.status", booking.id),
            { status },
            { preserveScroll: true },
        );
    };

    const destroy = (booking: Booking) => {
        if (
            confirm(`Permanently remove booking ${booking.booking_reference}?`)
        ) {
            router.delete(route("admin.bookings.destroy", booking.id));
        }
    };

    return (
        <AdminLayout title="Bookings">
            <Head title="Manage Bookings — Admin" />

            {props.flash?.success && (
                <div className="mb-6 rounded-md border border-brass/30 bg-brass/10 p-4 text-sm text-ink">
                    {props.flash.success}
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
                <form onSubmit={submitSearch} className="flex gap-2">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search reference, guest name, or email"
                        className="w-72 rounded-md border-hairline text-sm focus:border-brass focus:ring-brass"
                    />
                    <button
                        type="submit"
                        className="rounded-md border border-hairline px-4 text-sm text-ink"
                    >
                        Search
                    </button>
                </form>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => applyFilters({ status: undefined })}
                        className={`rounded-full border px-4 py-1.5 text-xs capitalize ${!filters.status ? "border-ink bg-ink text-ivory" : "border-hairline text-charcoal/70"}`}
                    >
                        All
                    </button>
                    {STATUSES.map((s) => (
                        <button
                            key={s}
                            onClick={() => applyFilters({ status: s })}
                            className={`rounded-full border px-4 py-1.5 text-xs capitalize ${filters.status === s ? "border-ink bg-ink text-ivory" : "border-hairline text-charcoal/70"}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-tag border border-hairline bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-hairline bg-ivory text-xs uppercase tracking-widest text-sage">
                        <tr>
                            <th className="px-5 py-3">Reference</th>
                            <th className="px-5 py-3">Guest</th>
                            <th className="px-5 py-3">Room</th>
                            <th className="px-5 py-3">Dates</th>
                            <th className="px-5 py-3">Total</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.data.map((booking) => (
                            <tr
                                key={booking.id}
                                className="border-b border-hairline last:border-0 align-top"
                            >
                                <td className="px-5 py-3 font-mono text-xs text-ink">
                                    {booking.booking_reference}
                                </td>
                                <td className="px-5 py-3">
                                    <p className="text-ink">
                                        {booking.user?.name}
                                    </p>
                                    <p className="text-xs text-sage">
                                        {booking.user?.email}
                                    </p>
                                </td>
                                <td className="px-5 py-3 text-charcoal/70">
                                    {booking.room.name}
                                </td>
                                <td className="px-5 py-3 text-charcoal/70">
                                    {booking.check_in} → {booking.check_out}
                                </td>
                                <td className="px-5 py-3 font-mono text-ink">
                                    ${booking.total_price.toFixed(2)}
                                </td>
                                <td className="px-5 py-3">
                                    <select
                                        value={booking.status}
                                        onChange={(e) =>
                                            updateStatus(
                                                booking,
                                                e.target.value,
                                            )
                                        }
                                        className={`rounded-full border-0 px-3 py-1 text-xs font-medium capitalize focus:ring-brass ${STATUS_STYLES[booking.status]}`}
                                    >
                                        {STATUSES.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-5 py-3 text-right">
                                    <button
                                        onClick={() => destroy(booking)}
                                        className="text-sm text-burgundy underline underline-offset-4"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {bookings.data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-5 py-12 text-center text-sage"
                                >
                                    No bookings match these filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
