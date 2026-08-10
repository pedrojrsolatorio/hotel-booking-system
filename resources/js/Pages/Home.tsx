import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import RoomSearchForm from "@/Components/RoomSearchForm";
import RoomCard from "@/Components/RoomCard";
import type { Room } from "@/types/models";

const AMENITIES = [
    {
        title: "Library Bar",
        copy: "A quiet room of old books and older whisky, open past midnight.",
    },
    {
        title: "Garden Terrace",
        copy: "Breakfast among the olive trees, weather permitting — and it usually does.",
    },
    {
        title: "Bath House",
        copy: "Steam, cedar, and a plunge pool kept two degrees colder than you\u2019d like.",
    },
    {
        title: "Concierge Desk",
        copy: "Reservations, recommendations, and the occasional impossible favor.",
    },
];

const TESTIMONIALS = [
    {
        quote: "The kind of quiet that makes you lower your voice on purpose.",
        name: "A. Whitfield",
    },
    {
        quote: "Booked in three minutes. Upgraded on arrival for no reason at all.",
        name: "M. Osei",
    },
    {
        quote: "I have stopped checking other hotels first. This is first now.",
        name: "R. Castellanos",
    },
];

export default function Home({ featuredRooms }: { featuredRooms: Room[] }) {
    return (
        <PublicLayout>
            <Head title="Verity House — A Quiet, Well-Kept House of Rooms" />

            {/* Hero */}
            <section className="relative overflow-hidden bg-ink">
                {/* <section className="relative bg-ink"> */}
                <div className="absolute inset-0 opacity-30">
                    <img
                        src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2000&auto=format&fit=crop"
                        alt=""
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="relative mx-auto max-w-7xl px-6 pb-32 pt-24 lg:px-8">
                    <p className="text-xs uppercase tracking-[0.3em] text-brass animate-fade-in-up">
                        Est. a house, not a chain
                    </p>
                    <h1
                        className="mt-6 max-w-2xl font-display text-5xl font-medium leading-[1.05] text-ivory lg:text-6xl animate-fade-in-up"
                        style={{ animationDelay: "80ms" }}
                    >
                        Rooms kept the way a good house should be —
                        <span className="italic text-brass">
                            {" "}
                            plainly, and well.
                        </span>
                    </h1>
                    <p
                        className="mt-6 max-w-lg text-ivory/70 animate-fade-in-up"
                        style={{ animationDelay: "160ms" }}
                    >
                        Twelve rooms, four suites, one library bar. No loyalty
                        points, no upsells at check-in — just a reservation you
                        can trust and a bed worth the trip.
                    </p>
                </div>

                {/* <div className="relative mx-auto -mb-20 max-w-5xl px-6 lg:px-8">
                    <RoomSearchForm />
                </div> */}
                {/* <div className="relative mx-auto max-w-5xl px-6 pb-5 pt-2 lg:px-8">
                    <RoomSearchForm />
                </div> */}
            </section>

            <div className="relative mx-auto -mt-10 max-w-5xl px-6 lg:px-8">
                <RoomSearchForm />
            </div>

            <div className="h-20" />

            {/* Featured rooms */}
            <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-brass">
                            Featured
                        </p>
                        <h2 className="mt-2 font-display text-3xl text-ink">
                            This week's rooms
                        </h2>
                    </div>
                    <Link
                        href={route("rooms.index")}
                        className="text-sm text-ink underline decoration-brass underline-offset-4"
                    >
                        View all rooms &amp; suites
                    </Link>
                </div>

                <div className="mt-10 grid gap-8 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredRooms.length === 0 ? (
                        <p className="col-span-full py-12 text-center text-sage">
                            Rooms are being prepared — check back shortly, or
                            browse all rooms directly.
                        </p>
                    ) : (
                        featuredRooms.map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))
                    )}
                </div>
            </section>

            {/* Amenities */}
            <section id="amenities" className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <p className="text-xs uppercase tracking-widest text-brass">
                        In the house
                    </p>
                    <h2 className="mt-2 font-display text-3xl text-ink">
                        A few things worth knowing about
                    </h2>

                    <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        {AMENITIES.map((a) => (
                            <div
                                key={a.title}
                                className="border-t border-hairline pt-5"
                            >
                                <h3 className="font-display text-lg text-ink">
                                    {a.title}
                                </h3>
                                <p className="mt-2 text-sm text-charcoal/70">
                                    {a.copy}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-ivory py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <p className="text-xs uppercase tracking-widest text-brass">
                        Guest book
                    </p>
                    <div className="mt-8 grid gap-8 lg:grid-cols-3">
                        {TESTIMONIALS.map((t) => (
                            <blockquote
                                key={t.name}
                                className="rounded-tag border border-hairline bg-white p-6"
                            >
                                <p className="font-display text-lg italic leading-snug text-ink">
                                    "{t.quote}"
                                </p>
                                <footer className="mt-4 text-xs uppercase tracking-widest text-sage">
                                    {t.name}
                                </footer>
                            </blockquote>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-ink py-20">
                <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
                    <h2 className="font-display text-3xl text-ivory">
                        Rooms go quickly on weekends.
                    </h2>
                    <p className="mt-3 text-ivory/60">
                        Check availability now — it takes less time than reading
                        this sentence twice.
                    </p>
                    <Link
                        href={route("rooms.index")}
                        className="mt-8 inline-block rounded-tag bg-brass px-8 py-3 text-sm font-medium text-ink transition hover:bg-ivory"
                    >
                        See available rooms
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
