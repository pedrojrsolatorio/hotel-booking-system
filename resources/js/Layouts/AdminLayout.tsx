import { PropsWithChildren, useState } from "react";
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
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const isActive = (routeName: string) => {
        const hrefPath = route(routeName).replace(/^https?:\/\/[^/]+/, "");
        return currentUrl.startsWith(hrefPath);
    };

    const navLinks = (onNavigate?: () => void) => (
        <nav className="mt-4 space-y-1 px-3">
            {NAV.map((item) => (
                <Link
                    key={item.route}
                    href={route(item.route)}
                    onClick={onNavigate}
                    className={`block rounded-md px-4 py-2.5 text-sm transition ${
                        isActive(item.route)
                            ? "bg-brass/20 text-brass"
                            : "text-ivory/70 hover:bg-ivory/5 hover:text-ivory"
                    }`}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );

    return (
        <div className="min-h-screen bg-ivory font-sans text-charcoal">
            {/* Mobile top bar */}
            <div className="flex items-center justify-between border-b border-hairline bg-ink px-4 py-3 text-ivory lg:hidden">
                <Link
                    href={route("home")}
                    className="font-display text-lg text-ivory"
                >
                    Verity House
                </Link>
                <button
                    onClick={() => setMobileNavOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-ivory/20"
                    aria-label="Open admin menu"
                >
                    ☰
                </button>
            </div>

            {/* Mobile off-canvas nav */}
            {mobileNavOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-ink/60"
                        onClick={() => setMobileNavOpen(false)}
                    />
                    <aside className="absolute inset-y-0 left-0 w-72 bg-ink text-ivory shadow-2xl">
                        <div className="flex items-center justify-between p-6">
                            <div>
                                <p className="font-display text-xl text-ivory">
                                    Verity House
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-widest text-brass">
                                    Admin
                                </p>
                            </div>
                            <button
                                onClick={() => setMobileNavOpen(false)}
                                className="text-ivory/60"
                                aria-label="Close menu"
                            >
                                ✕
                            </button>
                        </div>
                        {navLinks(() => setMobileNavOpen(false))}
                        <div className="mt-6 border-t border-ivory/10 p-6">
                            <p className="text-sm text-ivory">
                                {auth.user?.name}
                            </p>
                            <Link
                                href={route("home")}
                                className="mt-1 inline-block text-xs text-ivory/50 hover:text-ivory"
                            >
                                ← Back to site
                            </Link>
                        </div>
                    </aside>
                </div>
            )}

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

                    {navLinks()}

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
                    <header className="hidden border-b border-hairline bg-white px-6 py-6 lg:block lg:px-10">
                        <h1 className="font-display text-2xl text-ink">
                            {title}
                        </h1>
                    </header>
                    <div className="border-b border-hairline bg-white px-4 py-4 lg:hidden">
                        <h1 className="font-display text-xl text-ink">
                            {title}
                        </h1>
                    </div>
                    <div className="px-6 py-8 lg:px-10">{children}</div>
                </main>
            </div>
        </div>
    );
}
