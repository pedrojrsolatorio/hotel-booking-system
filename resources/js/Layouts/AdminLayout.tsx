import { PropsWithChildren } from "react";
import { Link, usePage } from "@inertiajs/react";
import type { Auth } from "@/types/models";

const NAV = [
    { label: "Overview", route: "admin.dashboard" },
    { label: "Rooms", route: "admin.rooms.index" },
    { label: "Bookings", route: "admin.bookings.index" },
    { label: "Users", route: "admin.users.index" },
];

export default function AdminLayout({
    children,
    title,
}: PropsWithChildren<{ title: string }>) {
    const page = usePage();
    const auth = (page.props as unknown as { auth: Auth }).auth;
    const currentUrl = page.url; // e.g. "/admin/rooms?page=2"

    return (
        <div className="min-h-screen bg-ivory font-sans text-charcoal">
            <div className="flex">
                <aside className="hidden w-64 shrink-0 border-r border-hairline bg-ink text-ivory lg:block">
                    <div className="p-6">
                        <Link
                            href={route("home")}
                            className="font-display text-xl text-ivory"
                        >
                            Verity House
                        </Link>
                        <p className="mt-1 text-xs uppercase tracking-widest text-brass">
                            Admin
                        </p>
                    </div>

                    <nav className="mt-4 space-y-1 px-3">
                        {NAV.map((item) => {
                            const href = route(item.route);
                            const hrefPath = href.replace(
                                /^https?:\/\/[^/]+/,
                                "",
                            );
                            const active = currentUrl.startsWith(hrefPath);
                            return (
                                <Link
                                    key={item.route}
                                    href={href}
                                    className={`block rounded-md px-4 py-2.5 text-sm transition ${
                                        active
                                            ? "bg-brass/20 text-brass"
                                            : "text-ivory/70 hover:bg-ivory/5 hover:text-ivory"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="absolute bottom-0 w-64 border-t border-ivory/10 p-6">
                        <p className="text-sm text-ivory">{auth.user?.name}</p>
                        <Link
                            href={route("home")}
                            className="mt-1 inline-block text-xs text-ivory/50 hover:text-ivory"
                        >
                            ← Back to site
                        </Link>
                    </div>
                </aside>

                <main className="min-w-0 flex-1">
                    <header className="border-b border-hairline bg-white px-6 py-6 lg:px-10">
                        <h1 className="font-display text-2xl text-ink">
                            {title}
                        </h1>
                    </header>
                    <div className="px-6 py-8 lg:px-10">{children}</div>
                </main>
            </div>
        </div>
    );
}
