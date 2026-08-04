import { FormEventHandler, useState } from "react";
import { router } from "@inertiajs/react";
import type { RoomFilters } from "@/types/models";

export default function RoomSearchForm({
    initial,
    compact = false,
}: {
    initial?: RoomFilters;
    compact?: boolean;
}) {
    const [checkIn, setCheckIn] = useState(initial?.check_in ?? "");
    const [checkOut, setCheckOut] = useState(initial?.check_out ?? "");
    const [guests, setGuests] = useState(initial?.guests ?? 2);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(route("rooms.index"), {
            check_in: checkIn || undefined,
            check_out: checkOut || undefined,
            guests,
        });
    };

    return (
        <form
            onSubmit={submit}
            className={`grid gap-4 rounded-tag border border-hairline bg-white/95 p-6 shadow-xl shadow-ink/5 backdrop-blur ${
                compact ? "sm:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-4"
            }`}
        >
            <label className="block">
                <span className="text-xs uppercase tracking-widest text-brass">
                    Check in
                </span>
                <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="mt-1 w-full rounded-md border-hairline text-sm text-charcoal focus:border-brass focus:ring-brass"
                />
            </label>

            <label className="block">
                <span className="text-xs uppercase tracking-widest text-brass">
                    Check out
                </span>
                <input
                    type="date"
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="mt-1 w-full rounded-md border-hairline text-sm text-charcoal focus:border-brass focus:ring-brass"
                />
            </label>

            <label className="block">
                <span className="text-xs uppercase tracking-widest text-brass">
                    Guests
                </span>
                <input
                    type="number"
                    min={1}
                    max={12}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border-hairline text-sm text-charcoal focus:border-brass focus:ring-brass"
                />
            </label>

            <button
                type="submit"
                className="mt-auto rounded-md bg-burgundy px-6 py-2.5 text-sm font-medium text-ivory transition hover:bg-ink"
            >
                Check availability
            </button>
        </form>
    );
}
