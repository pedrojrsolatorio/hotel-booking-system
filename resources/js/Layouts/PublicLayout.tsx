import { PropsWithChildren, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import type { Auth } from "@/types/models";
import ChatWidget from "@/Components/ChatWidget";

export default function PublicLayout({ children }: PropsWithChildren) {
    const { auth } = usePage().props as unknown as { auth: Auth };
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-ivory font-sans text-charcoal">
            <header className="border-b border-hairline bg-ivory/95 backdrop-blur sticky top-0 z-40">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
                    <Link
                        href={route("home")}
                        className="font-display text-2xl tracking-tight text-ink"
                    >
                        Verity House
                    </Link>

                    <div className="hidden items-center gap-8 text-sm md:flex">
                        <Link
                            href={route("rooms.index")}
                            className="text-charcoal/80 transition hover:text-brass"
                        >
                            Rooms &amp; Suites
                        </Link>
                        <Link
                            href={route("amenities.index")}
                            className="text-charcoal/80 transition hover:text-brass"
                        >
                            Amenities
                        </Link>
                        <Link
                            href={route("faq.index")}
                            className="text-charcoal/80 transition hover:text-brass"
                        >
                            FAQ
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <>
                                <Link
                                    href={route("bookings.index")}
                                    className="hidden text-sm text-charcoal/80 transition hover:text-brass sm:inline"
                                >
                                    My Bookings
                                </Link>
                                <Link
                                    href={
                                        auth.user.role === "admin"
                                            ? route("admin.dashboard")
                                            : route("dashboard")
                                    }
                                    className="rounded-tag border border-ink px-4 py-2 text-sm text-ink transition hover:bg-ink hover:text-ivory"
                                >
                                    Account
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="hidden text-sm text-charcoal/80 hover:text-brass sm:inline"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="rounded-tag bg-ink px-4 py-2 text-sm text-ivory transition hover:bg-charcoal"
                                >
                                    Book a Stay
                                </Link>
                            </>
                        )}

                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            className="ml-1 flex h-9 w-9 items-center justify-center rounded-md border border-hairline text-ink md:hidden"
                            aria-label="Toggle menu"
                            aria-expanded={menuOpen}
                        >
                            <span className="sr-only">Menu</span>
                            {menuOpen ? "✕" : "☰"}
                        </button>
                    </div>
                </nav>

                {menuOpen && (
                    <div className="border-t border-hairline bg-ivory px-6 py-4 md:hidden">
                        <div className="flex flex-col gap-3 text-sm">
                            <Link
                                href={route("rooms.index")}
                                onClick={() => setMenuOpen(false)}
                                className="text-charcoal/80 hover:text-brass"
                            >
                                Rooms &amp; Suites
                            </Link>
                            <Link
                                href={route("amenities.index")}
                                onClick={() => setMenuOpen(false)}
                                className="text-charcoal/80 hover:text-brass"
                            >
                                Amenities
                            </Link>
                            <Link
                                href={route("faq.index")}
                                onClick={() => setMenuOpen(false)}
                                className="text-charcoal/80 hover:text-brass"
                            >
                                FAQ
                            </Link>
                            {auth.user ? (
                                <Link
                                    href={route("bookings.index")}
                                    onClick={() => setMenuOpen(false)}
                                    className="text-charcoal/80 hover:text-brass"
                                >
                                    My Bookings
                                </Link>
                            ) : (
                                <Link
                                    href={route("login")}
                                    onClick={() => setMenuOpen(false)}
                                    className="text-charcoal/80 hover:text-brass"
                                >
                                    Sign in
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <main>{children}</main>

            <footer className="mt-24 bg-ink text-ivory/80">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div className="grid gap-12 md:grid-cols-4">
                        <div>
                            <p className="font-display text-xl text-ivory">
                                Verity House
                            </p>
                            <p className="mt-3 text-sm leading-relaxed text-ivory/60">
                                A quiet, well-kept house of rooms — booked
                                plainly, held honestly.
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-widest text-brass">
                                Explore
                            </p>
                            <ul className="mt-3 space-y-2 text-sm">
                                <li>
                                    <Link
                                        href={route("rooms.index")}
                                        className="hover:text-ivory"
                                    >
                                        Rooms &amp; Suites
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route("amenities.index")}
                                        className="hover:text-ivory"
                                    >
                                        Amenities
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route("faq.index")}
                                        className="hover:text-ivory"
                                    >
                                        FAQ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-widest text-brass">
                                Account
                            </p>
                            <ul className="mt-3 space-y-2 text-sm">
                                <li>
                                    <Link
                                        href={route("login")}
                                        className="hover:text-ivory"
                                    >
                                        Sign in
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route("register")}
                                        className="hover:text-ivory"
                                    >
                                        Create account
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-widest text-brass">
                                Contact
                            </p>
                            <ul className="mt-3 space-y-2 text-sm text-ivory/70">
                                <li>reservations@verityhouse.example</li>
                                <li>+1 (555) 019-2044</li>
                            </ul>
                        </div>
                    </div>
                    <p className="mt-12 border-t border-ivory/10 pt-6 text-xs text-ivory/40">
                        © {new Date().getFullYear()} Verity House. All rights
                        reserved.
                    </p>
                </div>
            </footer>

            <ChatWidget />
        </div>
    );
}
