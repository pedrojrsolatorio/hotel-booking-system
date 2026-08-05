import { Head, router } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import RoomCard from "@/Components/RoomCard";
import RoomSearchForm from "@/Components/RoomSearchForm";
import type { Room, RoomFilters } from "@/types/models";

const ROOM_TYPES = ["Standard", "Deluxe", "Suite", "Executive Suite"];

export default function RoomsIndex({
    rooms,
    filters,
}: {
    rooms: Room[];
    filters: RoomFilters;
}) {
    const setSort = (sort: RoomFilters["sort"]) => {
        router.get(
            route("rooms.index"),
            { ...filters, sort },
            { preserveScroll: true },
        );
    };

    const setType = (type: string | undefined) => {
        router.get(
            route("rooms.index"),
            { ...filters, type },
            { preserveScroll: true },
        );
    };

    return (
        <PublicLayout>
            <Head title="Rooms & Suites — Verity House" />

            <section className="bg-ink py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <p className="text-xs uppercase tracking-widest text-brass">
                        Rooms &amp; Suites
                    </p>
                    <h1 className="mt-2 font-display text-4xl text-ivory">
                        Find your room
                    </h1>
                </div>
                <div className="mx-auto mt-8 max-w-7xl px-6 lg:px-8">
                    <RoomSearchForm initial={filters} compact />
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setType(undefined)}
                            className={`rounded-full border px-4 py-1.5 text-xs ${
                                !filters.type
                                    ? "border-ink bg-ink text-ivory"
                                    : "border-hairline text-charcoal/70"
                            }`}
                        >
                            All types
                        </button>
                        {ROOM_TYPES.map((type) => (
                            <button
                                key={type}
                                onClick={() => setType(type)}
                                className={`rounded-full border px-4 py-1.5 text-xs ${
                                    filters.type === type
                                        ? "border-ink bg-ink text-ivory"
                                        : "border-hairline text-charcoal/70"
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <select
                        value={filters.sort ?? ""}
                        onChange={(e) =>
                            setSort(
                                (e.target.value ||
                                    undefined) as RoomFilters["sort"],
                            )
                        }
                        className="rounded-md border-hairline text-sm text-charcoal focus:border-brass focus:ring-brass"
                    >
                        <option value="">Sort: recommended</option>
                        <option value="price_asc">Price: low to high</option>
                        <option value="price_desc">Price: high to low</option>
                        <option value="capacity">
                            Capacity: largest first
                        </option>
                    </select>
                </div>

                {rooms.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="font-display text-2xl text-ink">
                            Nothing free for those dates.
                        </p>
                        <p className="mt-2 text-sm text-charcoal/60">
                            Try a different date range or clear your filters.
                        </p>
                    </div>
                ) : (
                    <div className="mt-10 grid gap-8 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                        {rooms.map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
