import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import RoomForm from "@/Components/Admin/RoomForm";

export default function AdminRoomsCreate() {
    return (
        <AdminLayout title="Add a room">
            <Head title="Add Room — Admin" />
            <RoomForm submitUrl={route("admin.rooms.store")} />
        </AdminLayout>
    );
}
