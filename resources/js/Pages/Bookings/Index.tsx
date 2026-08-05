import { Head, Link, router } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import type { Booking, PaginatedData } from "@/types/models";

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-brass/20 text-brass-dark",
    confirmed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-charcoal/10 text-charcoal/60",
    completed: "bg-sage/20 text-sage",
};

export default function BookingsIndex({
    bookings,
}: {
    bookings: PaginatedData<Booking>;
}) {
    const cancel = (booking: Booking) => {
        if (confirm(`Cancel reservation ${booking.booking_reference}?`)) {
            router.patch(
                route("bookings.cancel", booking.id),
                {},
                { preserveScroll: true },
            );
        }
    };

    return (
        <PublicLayout>
            <Head title="My Bookings — Verity House" />

            <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
                <p className="text-xs uppercase tracking-widest text-brass">
                    Your account
                </p>
                <h1 className="mt-2 font-display text-3xl text-ink">
                    My bookings
                </h1>

                {bookings.data.length === 0 ? (
                    <div className="mt-12 rounded-tag border border-hairline bg-white p-10 text-center">
                        <p className="font-display text-xl text-ink">
                            No reservations yet.
                        </p>
                        <Link
                            href={route("rooms.index")}
                            className="mt-4 inline-block text-sm text-brass underline underline-offset-4"
                        >
                            Browse rooms &amp; suites
                        </Link>
                    </div>
                ) : (
                    <div className="mt-10 space-y-4">
                        {bookings.data.map((booking) => (
                            <div
                                key={booking.id}
                                className="flex flex-col gap-4 rounded-tag border border-hairline bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    {booking.room.primary_image && (
                                        <img
                                            src={booking.room.primary_image}
                                            alt=""
                                            className="h-16 w-16 rounded-md object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="font-display text-lg text-ink">
                                            {booking.room.name}
                                        </p>
                                        <p className="text-sm text-sage">
                                            {booking.check_in} →{" "}
                                            {booking.check_out} ·{" "}
                                            {booking.guests} guest
                                            {booking.guests > 1 ? "s" : ""}
                                        </p>
                                        <p className="font-mono text-xs text-charcoal/60">
                                            {booking.booking_reference}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[booking.status]}`}
                                    >
                                        {booking.status}
                                    </span>
                                    <span className="font-mono text-sm text-ink">
                                        ${booking.total_price.toFixed(2)}
                                    </span>
                                    <Link
                                        href={route(
                                            "bookings.show",
                                            booking.id,
                                        )}
                                        className="text-sm text-ink underline decoration-brass underline-offset-4"
                                    >
                                        Details
                                    </Link>
                                    {booking.is_cancellable && (
                                        <button
                                            onClick={() => cancel(booking)}
                                            className="text-sm text-burgundy underline underline-offset-4"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
