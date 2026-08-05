import { Link } from "@inertiajs/react";
import type { Room } from "@/types/models";

export default function RoomCard({ room }: { room: Room }) {
    const image = room.primary_image ?? room.images?.[0]?.url;

    return (
        <Link
            href={route("rooms.show", room.slug)}
            className="key-tag block overflow-hidden pt-4"
        >
            <span className="key-tag__grommet" aria-hidden="true" />

            <div className="aspect-[4/3] w-full overflow-hidden bg-sage/20">
                {image ? (
                    <img
                        src={image}
                        alt={room.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sage">
                        No image yet
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-brass">
                            {room.type}
                        </p>
                        <h3 className="mt-1 font-display text-xl text-ink">
                            {room.name}
                        </h3>
                    </div>
                    <div className="text-right">
                        <p className="ledger-number font-mono text-lg text-ink">
                            ${room.price.toFixed(0)}
                        </p>
                        <p className="text-xs text-sage">per night</p>
                    </div>
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-charcoal/70">
                    {room.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-hairline pt-4 text-sm text-sage">
                    <span>Sleeps {room.capacity}</span>
                    <span className="font-mono text-xs">
                        {room.amenities.slice(0, 2).join(" · ")}
                        {room.amenities.length > 2
                            ? ` +${room.amenities.length - 2}`
                            : ""}
                    </span>
                </div>
            </div>
        </Link>
    );
}
