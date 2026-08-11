import { PropsWithChildren, useState, useEffect } from "react";
import { createPortal } from "react-dom";
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

    // Prevent the page underneath the mobile menu from scrolling.
    useEffect(() => {
        if (!mobileNavOpen) return;

        const html = document.documentElement;
        const body = document.body;

        const previousHtmlOverflow = html.style.overflow;
        const previousBodyOverflow = body.style.overflow;

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";

        return () => {
            html.style.overflow = previousHtmlOverflow;
            body.style.overflow = previousBodyOverflow;
        };
    }, [mobileNavOpen]);

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
            {mobileNavOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[9999] lg:hidden">
                        <div
                            className="absolute inset-0 bg-ink/60"
                            onClick={() => setMobileNavOpen(false)}
                        />
                        <aside className="fixed left-0 top-0 flex h-[100dvh] w-72 flex-col bg-ink text-ivory shadow-2xl">
                            <div className="flex shrink-0 items-center justify-between p-6">
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

                            <div className="min-h-0 flex-1 overflow-y-auto">
                                {navLinks(() => setMobileNavOpen(false))}
                            </div>

                            <div className="shrink-0 border-t border-ivory/10 p-6">
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
                    </div>,
                    document.body,
                )}

            <div className="flex">
                <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-hairline bg-ink text-ivory lg:flex">
                    <div className="shrink-0 p-6">
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

                    <div className="min-h-0 flex-1 overflow-y-auto">
                        {navLinks()}
                    </div>

                    <div className="shrink-0 border-t border-ivory/10 p-6">
                        <p className="text-sm text-ivory">{auth.user?.name}</p>
                        <Link
                            href={route("home")}
                            className="mt-1 inline-block text-xs text-ivory/50 hover:text-ivory"
                        >
                            ← Back to site
                        </Link>
                    </div>
                </aside>

                <main className="min-w-0 flex-1 lg:ml-64">
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
