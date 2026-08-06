import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import RoomForm from "@/Components/Admin/RoomForm";
import type { Room } from "@/types/models";

export default function AdminRoomsEdit({ room }: { room: Room }) {
    return (
        <AdminLayout title={`Edit — ${room.name}`}>
            <Head title={`Edit ${room.name} — Admin`} />
            <RoomForm
                room={room}
                submitUrl={route("admin.rooms.update", room.id)}
            />
        </AdminLayout>
    );
}
