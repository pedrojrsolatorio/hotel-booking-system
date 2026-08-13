import type { HotelAmenity } from "@/data/amenities";

export default function AmenitiesGrid({
    amenities,
}: {
    amenities: HotelAmenity[];
}) {
    return (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {amenities.map((a) => (
                <div key={a.title} className="border-t border-hairline pt-5">
                    <h3 className="font-display text-lg text-ink">{a.title}</h3>
                    <p className="mt-2 text-sm text-charcoal/70">{a.copy}</p>
                </div>
            ))}
        </div>
    );
}
