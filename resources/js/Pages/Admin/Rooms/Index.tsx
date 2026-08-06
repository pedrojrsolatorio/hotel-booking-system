import { Head, Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import type { PaginatedData, Room } from "@/types/models";

const STATUS_STYLES: Record<string, string> = {
    available: "bg-emerald-100 text-emerald-800",
    unavailable: "bg-charcoal/10 text-charcoal/60",
    maintenance: "bg-brass/20 text-brass-dark",
};

export default function AdminRoomsIndex({
    rooms,
}: {
    rooms: PaginatedData<Room>;
}) {
    const { props } = usePage<{ flash?: { success?: string } }>();

    const destroy = (room: Room) => {
        if (confirm(`Delete "${room.name}"? This can't be undone.`)) {
            router.delete(route("admin.rooms.destroy", room.id));
        }
    };

    return (
        <AdminLayout title="Rooms">
            <Head title="Manage Rooms — Admin" />

            {props.flash?.success && (
                <div className="mb-6 rounded-md border border-brass/30 bg-brass/10 p-4 text-sm text-ink">
                    {props.flash.success}
                </div>
            )}

            <div className="flex justify-end">
                <Link
                    href={route("admin.rooms.create")}
                    className="rounded-md bg-burgundy px-5 py-2.5 text-sm font-medium text-ivory transition hover:bg-ink"
                >
                    + Add room
                </Link>
            </div>

            <div className="mt-6 overflow-hidden rounded-tag border border-hairline bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-hairline bg-ivory text-xs uppercase tracking-widest text-sage">
                        <tr>
                            <th className="px-5 py-3">Room</th>
                            <th className="px-5 py-3">Type</th>
                            <th className="px-5 py-3">Price</th>
                            <th className="px-5 py-3">Capacity</th>
                            <th className="px-5 py-3">Units</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.data.map((room) => (
                            <tr
                                key={room.id}
                                className="border-b border-hairline last:border-0"
                            >
                                <td className="flex items-center gap-3 px-5 py-3">
                                    {room.primary_image && (
                                        <img
                                            src={room.primary_image}
                                            alt=""
                                            className="h-10 w-10 rounded-md object-cover"
                                        />
                                    )}
                                    <span className="font-medium text-ink">
                                        {room.name}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-charcoal/70">
                                    {room.type}
                                </td>
                                <td className="px-5 py-3 font-mono text-ink">
                                    ${room.price.toFixed(0)}
                                </td>
                                <td className="px-5 py-3 text-charcoal/70">
                                    {room.capacity}
                                </td>
                                <td className="px-5 py-3 text-charcoal/70">
                                    {room.total_units}
                                </td>
                                <td className="px-5 py-3">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[room.status]}`}
                                    >
                                        {room.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-right">
                                    <Link
                                        href={route(
                                            "admin.rooms.edit",
                                            room.id,
                                        )}
                                        className="text-sm text-ink underline decoration-brass underline-offset-4"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => destroy(room)}
                                        className="ml-4 text-sm text-burgundy underline underline-offset-4"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {rooms.data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-5 py-12 text-center text-sage"
                                >
                                    No rooms yet. Add your first room to get
                                    started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {rooms.links && (
                <div className="mt-6 flex flex-wrap gap-2">
                    {rooms.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? "#"}
                            className={`rounded-md px-3 py-1.5 text-sm ${
                                link.active
                                    ? "bg-ink text-ivory"
                                    : "text-charcoal/60 hover:bg-hairline"
                            } ${!link.url ? "pointer-events-none opacity-40" : ""}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
