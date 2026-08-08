export interface RoomImage {
    id: number;
    url: string;
    is_primary: boolean;
    sort_order: number;
}

export interface Room {
    id: number;
    name: string;
    slug: string;
    description: string;
    type: string;
    price: number;
    capacity: number;
    amenities: string[];
    total_units: number;
    status: "available" | "unavailable" | "maintenance";
    images: RoomImage[];
    primary_image?: string | null;
    created_at?: string;
}

export interface BookingPayment {
    amount: number;
    payment_status: "pending" | "paid" | "failed" | "refunded";
    payment_method: string | null;
}

export interface Booking {
    id: number;
    booking_reference: string;
    check_in: string;
    check_out: string;
    nights: number;
    guests: number;
    total_price: number;
    special_requests: string | null;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    is_cancellable: boolean;
    room: Room;
    user?: { id: number; name: string; email: string };
    payment?: BookingPayment | null;
    created_at?: string;
}

export interface RoomFilters {
    check_in?: string;
    check_out?: string;
    guests?: number;
    type?: string;
    sort?: "price_asc" | "price_desc" | "capacity";
}

export interface PaginatedData<T> {
    data: T[];
    // links: { url: string | null; label: string; active: boolean }[];
    // meta?: { current_page: number; last_page: number; total: number };
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta?: {
        current_page: number;
        from: number | null;
        last_page: number;
        path: string;
        per_page: number;
        to: number | null;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}

export interface Auth {
    user: {
        id: number;
        name: string;
        email: string;
        role: "customer" | "admin";
    } | null;
}
