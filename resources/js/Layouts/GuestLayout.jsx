import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center bg-ivory pt-6 sm:justify-center sm:pt-0 text-charcoal">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-ink" />
                </Link>
            </div>

            <div className="mt-12 w-full overflow-hidden rounded-tag border border-hairline bg-white px-6 py-8 shadow-xl sm:max-w-md">
                {children}
            </div>
        </div>
    );
}
