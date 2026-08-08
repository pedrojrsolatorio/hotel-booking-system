import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Tooltip,
    Legend,
);

interface Stats {
    total_bookings: number;
    revenue: number;
    available_rooms: number;
    total_rooms: number;
    occupancy_rate: number;
}

interface MonthPoint {
    month: string;
    value: number;
}

interface RoomTypeCount {
    type: string;
    count: number;
}

const PALETTE = ["#B08D57", "#6E2B34", "#7C8B7A", "#1B2E28"];

const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: "#7C8B7A", font: { size: 11 } },
        },
        y: {
            grid: { color: "#E7E0D2" },
            ticks: { color: "#7C8B7A", font: { size: 11 } },
        },
    },
};

export default function AdminDashboard({
    stats,
    monthlyBookings,
    revenueTrend,
    popularRoomTypes,
}: {
    stats: Stats;
    monthlyBookings: MonthPoint[];
    revenueTrend: MonthPoint[];
    popularRoomTypes: RoomTypeCount[];
}) {
    const bookingsData = {
        labels: monthlyBookings.map((m) => m.month),
        datasets: [
            {
                label: "Bookings",
                data: monthlyBookings.map((m) => m.value),
                backgroundColor: "#B08D57",
                borderRadius: 6,
            },
        ],
    };

    const revenueData = {
        labels: revenueTrend.map((m) => m.month),
        datasets: [
            {
                label: "Revenue",
                data: revenueTrend.map((m) => m.value),
                borderColor: "#6E2B34",
                backgroundColor: "#6E2B3420",
                tension: 0.35,
                fill: true,
                pointRadius: 0,
            },
        ],
    };

    const roomTypeData = {
        labels: popularRoomTypes.map((r) => r.type),
        datasets: [
            {
                data: popularRoomTypes.map((r) => r.count),
                backgroundColor: PALETTE,
                borderWidth: 0,
            },
        ],
    };

    return (
        <AdminLayout title="Overview">
            <Head title="Admin Dashboard — Verity House" />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total bookings"
                    value={stats.total_bookings.toLocaleString()}
                />
                <StatCard
                    label="Revenue (confirmed+)"
                    value={`$${stats.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                />
                <StatCard
                    label="Available rooms"
                    value={`${stats.available_rooms} / ${stats.total_rooms}`}
                />
                <StatCard
                    label="Occupancy right now"
                    value={`${stats.occupancy_rate}%`}
                />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <ChartCard title="Monthly bookings">
                    <div className="h-64">
                        <Bar data={bookingsData} options={baseOptions} />
                    </div>
                </ChartCard>

                <ChartCard title="Revenue trend">
                    <div className="h-64">
                        <Line
                            data={revenueData}
                            options={{
                                ...baseOptions,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        callbacks: {
                                            label: (ctx) =>
                                                `$${Number(ctx.parsed.y).toLocaleString()}`,
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </ChartCard>

                <ChartCard title="Popular room types">
                    {popularRoomTypes.length === 0 ? (
                        <EmptyChart />
                    ) : (
                        <div className="h-64">
                            <Doughnut
                                data={roomTypeData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    cutout: "62%",
                                }}
                            />
                        </div>
                    )}
                    <ul className="mt-4 space-y-1 text-sm">
                        {popularRoomTypes.map((row, index) => (
                            <li
                                key={row.type}
                                className="flex items-center gap-2 text-charcoal/70"
                            >
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                        backgroundColor:
                                            PALETTE[index % PALETTE.length],
                                    }}
                                />
                                {row.type} — {row.count}
                            </li>
                        ))}
                    </ul>
                </ChartCard>
            </div>
        </AdminLayout>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-tag border border-hairline bg-white p-6">
            <p className="text-xs uppercase tracking-widest text-brass">
                {label}
            </p>
            <p className="mt-2 font-mono text-3xl text-ink">{value}</p>
        </div>
    );
}

function ChartCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-tag border border-hairline bg-white p-6">
            <p className="font-display text-lg text-ink">{title}</p>
            <div className="mt-4">{children}</div>
        </div>
    );
}

function EmptyChart() {
    return (
        <p className="py-16 text-center text-sm text-sage">
            No bookings yet — data will appear here once guests start booking.
        </p>
    );
}
