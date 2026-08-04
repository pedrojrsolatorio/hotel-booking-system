import { Head, Link, router, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import type { Booking } from "@/types/models";

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-brass/20 text-brass-dark",
    confirmed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-charcoal/10 text-charcoal/60",
    completed: "bg-sage/20 text-sage",
};

export default function BookingShow({ booking }: { booking: Booking }) {
    const { props } = usePage<{ flash?: { success?: string } }>();

    const cancel = () => {
        if (confirm("Cancel this reservation? This cannot be undone.")) {
            router.patch(route("bookings.cancel", booking.id));
        }
    };

    return (
        <PublicLayout>
            <Head
                title={`Booking ${booking.booking_reference} — Verity House`}
            />

            <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
                {props.flash?.success && (
                    <div className="mb-8 rounded-md border border-brass/30 bg-brass/10 p-4 text-sm text-ink">
                        {props.flash.success}
                    </div>
                )}

                <p className="text-xs uppercase tracking-widest text-brass">
                    Reservation confirmed
                </p>
                <h1 className="mt-2 font-display text-3xl text-ink">
                    Thank you, we'll see you soon.
                </h1>

                <div className="key-tag mt-8 p-6 pt-8">
                    <span className="key-tag__grommet" aria-hidden="true" />

                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-mono text-xs uppercase tracking-widest text-sage">
                                Reference
                            </p>
                            <p className="ledger-number font-mono text-lg text-ink">
                                {booking.booking_reference}
                            </p>
                        </div>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[booking.status]}`}
                        >
                            {booking.status}
                        </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-6 border-t border-hairline pt-6 text-sm">
                        <div>
                            <p className="text-sage">Room</p>
                            <p className="mt-1 font-display text-lg text-ink">
                                {booking.room.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-sage">Guests</p>
                            <p className="mt-1 text-ink">{booking.guests}</p>
                        </div>
                        <div>
                            <p className="text-sage">Check in</p>
                            <p className="mt-1 text-ink">{booking.check_in}</p>
                        </div>
                        <div>
                            <p className="text-sage">Check out</p>
                            <p className="mt-1 text-ink">{booking.check_out}</p>
                        </div>
                        {booking.special_requests && (
                            <div className="col-span-2">
                                <p className="text-sage">Special requests</p>
                                <p className="mt-1 text-ink">
                                    {booking.special_requests}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-between border-t border-hairline pt-6">
                        <span className="text-sm text-sage">
                            {booking.nights} night
                            {booking.nights > 1 ? "s" : ""} total
                        </span>
                        <span className="font-mono text-xl text-ink">
                            ${booking.total_price.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="mt-8 flex gap-4">
                    <Link
                        href={route("bookings.index")}
                        className="text-sm text-ink underline decoration-brass underline-offset-4"
                    >
                        View all my bookings
                    </Link>
                    {booking.is_cancellable && (
                        <button
                            onClick={cancel}
                            className="text-sm text-burgundy underline underline-offset-4"
                        >
                            Cancel reservation
                        </button>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
