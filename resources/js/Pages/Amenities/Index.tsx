import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import AmenitiesGrid from "@/Components/AmenitiesGrid";
import { HOTEL_AMENITIES } from "@/data/amenities";

export default function AmenitiesIndex() {
    return (
        <PublicLayout>
            <Head title="Amenities — Verity House" />

            <section className="bg-ink py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <p className="text-xs uppercase tracking-widest text-brass">
                        Amenities
                    </p>
                    <h1 className="mt-2 font-display text-4xl text-ivory">
                        In the house
                    </h1>
                    <p className="mt-4 max-w-xl text-ivory/70">
                        A few things worth knowing about — spaces kept with the
                        same care as the rooms themselves.
                    </p>
                </div>
            </section>

            <section className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <AmenitiesGrid amenities={HOTEL_AMENITIES} />
                </div>
            </section>

            <section className="bg-ink py-20">
                <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
                    <h2 className="font-display text-3xl text-ivory">
                        Ready to stay?
                    </h2>
                    <p className="mt-3 text-ivory/60">
                        Browse available rooms and book your visit.
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
