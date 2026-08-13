import { Head } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import type { Faq } from "@/types/models";

const CATEGORY_LABELS: Record<string, string> = {
    booking: "Booking",
    payment: "Payment",
    general: "General",
    amenities: "Amenities",
};

function groupByCategory(faqs: Faq[]): Map<string, Faq[]> {
    const groups = new Map<string, Faq[]>();

    for (const faq of faqs) {
        const category = faq.category ?? "general";
        const existing = groups.get(category) ?? [];
        existing.push(faq);
        groups.set(category, existing);
    }

    return groups;
}

export default function FaqIndex({ faqs }: { faqs: Faq[] }) {
    const grouped = groupByCategory(faqs);

    return (
        <PublicLayout>
            <Head title="FAQ — Verity House" />

            <section className="bg-ink py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <p className="text-xs uppercase tracking-widest text-brass">
                        FAQ
                    </p>
                    <h1 className="mt-2 font-display text-4xl text-ivory">
                        Common questions
                    </h1>
                    <p className="mt-4 max-w-xl text-ivory/70">
                        Everything you might want to know before booking — and
                        a few things you might not have thought to ask.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
                {faqs.length === 0 ? (
                    <p className="py-12 text-center text-sage">
                        No questions have been added yet. Contact us at
                        reservations@verityhouse.example and we will help.
                    </p>
                ) : (
                    <div className="space-y-12">
                        {[...grouped.entries()].map(([category, items]) => (
                            <div key={category}>
                                <p className="text-xs uppercase tracking-widest text-brass">
                                    {CATEGORY_LABELS[category] ?? category}
                                </p>
                                <div className="mt-4 space-y-3">
                                    {items.map((faq) => (
                                        <details
                                            key={faq.id}
                                            className="group rounded-tag border border-hairline bg-white"
                                        >
                                            <summary className="cursor-pointer list-none px-6 py-4 font-display text-lg text-ink transition hover:text-brass [&::-webkit-details-marker]:hidden">
                                                <span className="flex items-center justify-between gap-4">
                                                    {faq.question}
                                                    <span
                                                        aria-hidden
                                                        className="shrink-0 text-brass transition group-open:rotate-45"
                                                    >
                                                        +
                                                    </span>
                                                </span>
                                            </summary>
                                            <div className="border-t border-hairline px-6 py-4 text-sm leading-relaxed text-charcoal/70">
                                                {faq.answer}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <p className="mt-12 text-center text-sm text-sage">
                    Still have questions? Use the chat assistant in the
                    corner — it knows these answers too.
                </p>
            </section>
        </PublicLayout>
    );
}
