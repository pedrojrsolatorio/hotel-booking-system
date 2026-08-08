import { FormEventHandler, useState } from "react";
import { useForm } from "@inertiajs/react";
import type { Room } from "@/types/models";

const ROOM_TYPES = ["Standard", "Deluxe", "Suite", "Executive Suite"];
const STATUSES = ["available", "unavailable", "maintenance"];

type RoomFormData = {
    name: string;
    description: string;
    type: string;
    price: string;
    capacity: string;
    amenities: string[];
    total_units: string;
    status: string;
    images: File[];
    _method?: "put";
};

export default function RoomForm({
    room,
    submitUrl,
}: {
    room?: Room;
    submitUrl: string;
}) {
    const [amenityInput, setAmenityInput] = useState("");

    const { data, setData, post, processing, errors } = useForm<RoomFormData>({
        name: room?.name ?? "",
        description: room?.description ?? "",
        type: room?.type ?? ROOM_TYPES[0],
        price: room ? String(room.price) : "",
        capacity: room ? String(room.capacity) : "2",
        amenities: room?.amenities ?? [],
        total_units: room ? String(room.total_units) : "1",
        status: room?.status ?? "available",
        images: [],
        ...(room ? { _method: "put" } : {}),
    });

    const addAmenity = () => {
        const value = amenityInput.trim();
        if (value && !data.amenities.includes(value)) {
            setData("amenities", [...data.amenities, value]);
        }
        setAmenityInput("");
    };

    const removeAmenity = (amenity: string) => {
        setData(
            "amenities",
            data.amenities.filter((a) => a !== amenity),
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(submitUrl, { forceFormData: true });
    };

    return (
        <form onSubmit={submit} className="max-w-3xl space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                    <span className="text-xs uppercase tracking-widest text-sage">
                        Room name
                    </span>
                    <input
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="mt-1 w-full rounded-md border-hairline text-sm focus:border-brass focus:ring-brass"
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs text-burgundy">
                            {errors.name}
                        </p>
                    )}
                </label>

                <label className="block">
                    <span className="text-xs uppercase tracking-widest text-sage">
                        Type
                    </span>
                    <select
                        value={data.type}
                        onChange={(e) => setData("type", e.target.value)}
                        className="mt-1 w-full rounded-md border-hairline text-sm focus:border-brass focus:ring-brass"
                    >
                        {ROOM_TYPES.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <label className="block">
                <span className="text-xs uppercase tracking-widest text-sage">
                    Description
                </span>
                <textarea
                    rows={4}
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    className="mt-1 w-full rounded-md border-hairline text-sm focus:border-brass focus:ring-brass"
                />
                {errors.description && (
                    <p className="mt-1 text-xs text-burgundy">
                        {errors.description}
                    </p>
                )}
            </label>

            <div className="grid gap-6 sm:grid-cols-3">
                <label className="block">
                    <span className="text-xs uppercase tracking-widest text-sage">
                        Price / night
                    </span>
                    <input
                        type="number"
                        step="0.01"
                        value={data.price}
                        onChange={(e) => setData("price", e.target.value)}
                        className="mt-1 w-full rounded-md border-hairline text-sm focus:border-brass focus:ring-brass"
                    />
                    {errors.price && (
                        <p className="mt-1 text-xs text-burgundy">
                            {errors.price}
                        </p>
                    )}
                </label>

                <label className="block">
                    <span className="text-xs uppercase tracking-widest text-sage">
                        Capacity
                    </span>
                    <input
                        type="number"
                        min={1}
                        value={data.capacity}
                        onChange={(e) => setData("capacity", e.target.value)}
                        className="mt-1 w-full rounded-md border-hairline text-sm focus:border-brass focus:ring-brass"
                    />
                    {errors.capacity && (
                        <p className="mt-1 text-xs text-burgundy">
                            {errors.capacity}
                        </p>
                    )}
                </label>

                <label className="block">
                    <span className="text-xs uppercase tracking-widest text-sage">
                        Total units
                    </span>
                    <input
                        type="number"
                        min={1}
                        value={data.total_units}
                        onChange={(e) => setData("total_units", e.target.value)}
                        className="mt-1 w-full rounded-md border-hairline text-sm focus:border-brass focus:ring-brass"
                    />
                    {errors.total_units && (
                        <p className="mt-1 text-xs text-burgundy">
                            {errors.total_units}
                        </p>
                    )}
                </label>
            </div>

            <label className="block sm:w-1/3">
                <span className="text-xs uppercase tracking-widest text-sage">
                    Status
                </span>
                <select
                    value={data.status}
                    onChange={(e) => setData("status", e.target.value)}
                    className="mt-1 w-full rounded-md border-hairline text-sm capitalize focus:border-brass focus:ring-brass"
                >
                    {STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </label>

            <div>
                <span className="text-xs uppercase tracking-widest text-sage">
                    Amenities
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                    {data.amenities.map((a) => (
                        <span
                            key={a}
                            className="flex items-center gap-2 rounded-full bg-ivory px-3 py-1 text-xs text-charcoal"
                        >
                            {a}
                            <button
                                type="button"
                                onClick={() => removeAmenity(a)}
                                className="text-sage hover:text-burgundy"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
                <div className="mt-2 flex gap-2">
                    <input
                        value={amenityInput}
                        onChange={(e) => setAmenityInput(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addAmenity())
                        }
                        placeholder="e.g. Ocean View"
                        className="w-full max-w-xs rounded-md border-hairline text-sm focus:border-brass focus:ring-brass"
                    />
                    <button
                        type="button"
                        onClick={addAmenity}
                        className="rounded-md border border-hairline px-4 text-sm text-ink"
                    >
                        Add
                    </button>
                </div>
            </div>

            <label className="block">
                <span className="text-xs uppercase tracking-widest text-sage">
                    {room ? "Add more photos" : "Photos"}
                </span>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                        setData("images", Array.from(e.target.files ?? []))
                    }
                    className="mt-1 block w-full text-sm text-charcoal/70 file:mr-4 file:rounded-md file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:text-ivory"
                />
                {errors.images && (
                    <p className="mt-1 text-xs text-burgundy">
                        {errors.images}
                    </p>
                )}
            </label>

            {room && room.images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {room.images.map((img) => (
                        <img
                            key={img.id}
                            src={img.url}
                            alt=""
                            className="h-16 w-16 rounded-md object-cover"
                        />
                    ))}
                </div>
            )}

            <button
                type="submit"
                disabled={processing}
                className="rounded-md bg-burgundy px-6 py-3 text-sm font-medium text-ivory transition hover:bg-ink disabled:opacity-50"
            >
                {processing ? "Saving…" : room ? "Save changes" : "Create room"}
            </button>
        </form>
    );
}
