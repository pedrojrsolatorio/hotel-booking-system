import { FormEventHandler, useMemo, useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import RoomCard from "@/Components/RoomCard";
import type { Auth, Room } from "@/types/models";

function nightsBetween(checkIn: string, checkOut: string): number {
    if (!checkIn || !checkOut) return 0;
    const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(Math.round(ms / (1000 * 60 * 60 * 24)), 0);
}

export default function RoomShow({
    room,
    similarRooms,
}: {
    room: Room;
    similarRooms: Room[];
}) {
    const { auth } = usePage().props as unknown as { auth: Auth };
    const [activeImage, setActiveImage] = useState(
        room.images[0]?.url ?? room.primary_image ?? "",
    );

    const { data, setData, post, processing, errors } = useForm({
        room_id: room.id,
        check_in: "",
        check_out: "",
        guests: 2,
        special_requests: "",
    });

    const nights = useMemo(
        () => nightsBetween(data.check_in, data.check_out),
        [data.check_in, data.check_out],
    );
    const total = nights * room.price;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("bookings.store"));
    };

    return (
        <PublicLayout>
            <Head title={`${room.name} — Verity House`} />

            <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <p className="text-xs uppercase tracking-widest text-brass">
                    {room.type}
                </p>
                <h1 className="mt-1 font-display text-4xl text-ink">
                    {room.name}
                </h1>

                <div className="mt-8 grid gap-4 lg:grid-cols-4">
                    <div className="aspect-[16/10] overflow-hidden rounded-tag bg-sage/20 lg:col-span-3">
                        {activeImage ? (
                            <img
                                src={activeImage}
                                alt={room.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sage">
                                No image yet
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-4 gap-3 lg:grid-cols-1">
                        {room.images.map((img) => (
                            <button
                                key={img.id}
                                onClick={() => setActiveImage(img.url)}
                                className={`aspect-square overflow-hidden rounded-md border-2 ${
                                    activeImage === img.url
                                        ? "border-brass"
                                        : "border-transparent"
                                }`}
                            >
                                <img
                                    src={img.url}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-12 grid gap-12 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <h2 className="font-display text-2xl text-ink">
                            About this room
                        </h2>
                        <p className="mt-4 whitespace-pre-line text-charcoal/80">
                            {room.description}
                        </p>

                        <h3 className="mt-10 font-display text-xl text-ink">
                            Facilities
                        </h3>
                        <ul className="mt-4 grid grid-cols-2 gap-3 text-sm text-charcoal/80 sm:grid-cols-3">
                            {room.amenities.map((a) => (
                                <li key={a} className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                                    {a}
                                </li>
                            ))}
                        </ul>

                        <p className="mt-10 text-sm text-sage">
                            Sleeps up to {room.capacity} guests.
                        </p>
                    </div>

                    {/* Booking card */}
                    <div className="key-tag h-fit p-6 pt-8 lg:sticky lg:top-28">
                        <span className="key-tag__grommet" aria-hidden="true" />
                        <p className="text-xs uppercase tracking-widest text-brass">
                            Reserve this room
                        </p>
                        <p className="mt-1 font-mono text-2xl text-ink">
                            ${room.price.toFixed(0)}
                            <span className="text-sm text-sage"> / night</span>
                        </p>

                        {!auth.user ? (
                            <div className="mt-6 rounded-md bg-ivory p-4 text-sm text-charcoal/80">
                                <Link
                                    href={route("login")}
                                    className="font-medium text-brass underline"
                                >
                                    Sign in
                                </Link>{" "}
                                or{" "}
                                <Link
                                    href={route("register")}
                                    className="font-medium text-brass underline"
                                >
                                    create an account
                                </Link>{" "}
                                to book.
                            </div>
                        ) : (
                            <form onSubmit={submit} className="mt-6 space-y-4">
                                {errors.room_id && (
                                    <p className="text-sm text-burgundy">
                                        {errors.room_id}
                                    </p>
                                )}

                                <label className="block">
                                    <span className="text-xs uppercase tracking-widest text-sage">
                                        Check in
                                    </span>
                                    <input
                                        type="date"
                                        required
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        value={data.check_in}
                                        onChange={(e) =>
                                            setData("check_in", e.target.value)
                                        }
                                        className="mt-1 w-full rounded-md border-hairline text-sm focus:border-brass focus:ring-brass"
                                    />
                                    {errors.check_in && (
                                        <p className="mt-1 text-xs text-burgundy">
                                            {errors.check_in}
                                        </p>
                                    )}
                                </label>

                                <label className="block">
                                    <span className="text-xs uppercase tracking-widest text-sage">
                                        Check out
                                    </span>
                                    <input
                                        type="date"
                                        required
                                        min={
                                            data.check_in ||
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        value={data.check_out}
                                        onChange={(e) =>
                                            setData("check_out", e.target.value)
                                        }
                                        className="mt-1 w-full rounded-md border-hairline text-sm focus:border-brass focus:ring-brass"
                                    />
                                    {errors.check_out && (
                                        <p className="mt-1 text-xs text-burgundy">
                                            {errors.check_out}
                                        </p>
                                    )}
                                </label>

                                <label className="block">
                                    <span className="text-xs uppercase tracking-widest text-sage">
                                        Guests
                                    </span>
                                    <input
                                        type="number"
                                        required
                                        min={1}
                                        max={room.capacity}
                                        value={data.guests}
                                        onChange={(e) =>
                                            setData(
                                                "guests",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="mt-1 w-full rounded-md border-hairline text-sm focus:border-brass focus:ring-brass"
                                    />
                                    {errors.guests && (
                                        <p className="mt-1 text-xs text-burgundy">
                                            {errors.guests}
                                        </p>
                                    )}
                                </label>

                                <label className="block">
                                    <span className="text-xs uppercase tracking-widest text-sage">
                                        Special requests (optional)
                                    </span>
                                    <textarea
                                        value={data.special_requests}
                                        onChange={(e) =>
                                            setData(
                                                "special_requests",
                                                e.target.value,
                                            )
                                        }
                                        rows={2}
                                        className="mt-1 w-full rounded-md border-hairline text-sm focus:border-brass focus:ring-brass"
                                    />
                                </label>

                                {nights > 0 && (
                                    <div className="rounded-md border border-hairline bg-ivory p-4 text-sm">
                                        <div className="flex justify-between text-charcoal/70">
                                            <span>
                                                ${room.price.toFixed(0)} ×{" "}
                                                {nights} night
                                                {nights > 1 ? "s" : ""}
                                            </span>
                                            <span className="font-mono">
                                                ${total.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex justify-between border-t border-hairline pt-2 font-medium text-ink">
                                            <span>Total</span>
                                            <span className="font-mono">
                                                ${total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={processing || nights === 0}
                                    className="w-full rounded-md bg-burgundy py-3 text-sm font-medium text-ivory transition hover:bg-ink disabled:opacity-50"
                                >
                                    {processing
                                        ? "Confirming…"
                                        : "Confirm reservation"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {similarRooms.length > 0 && (
                    <div className="mt-20">
                        <h2 className="font-display text-2xl text-ink">
                            You might also like
                        </h2>
                        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {similarRooms.map((r) => (
                                <RoomCard key={r.id} room={r} />
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
